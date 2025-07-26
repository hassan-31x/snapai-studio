"use server";

import { v4 as uuidv4 } from 'uuid';
import { uploadBase64ToCloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/db';
import { ProductImageType } from '@prisma/client';

export interface GenerateVariationsParams {
  originalImageId: string;
  numberOfVariations: number;
  userId: string;
}

export interface UpscaleImageParams {
  originalImageId: string;
  userId: string;
}

export interface ImageVariationResponse {
  success: boolean;
  variations?: Array<{
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  }>;
  error?: string;
}

export interface ImageUpscaleResponse {
  success: boolean;
  upscaledImage?: {
    id: string;
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    scene: string;
  };
  error?: string;
}

/**
 * Generate variations of an existing product image
 */
export async function generateImageVariations(params: GenerateVariationsParams): Promise<ImageVariationResponse> {
  try {
    // Get the original image data
    const originalImage = await db.productImage.findUnique({
      where: { id: params.originalImageId }
    });

    if (!originalImage) {
      return {
        success: false,
        error: "Original image not found"
      };
    }

    // Generate variation prompts using OpenAI
    const variationPrompts = await generateVariationPrompts(originalImage.prompt, params.numberOfVariations);

    // Generate images using OpenAI Image Edit API
    const variationPromises = variationPrompts.map((prompt, index) => 
      generateSingleVariation(
        prompt,
        originalImage.imageUrl,
        originalImage.aspectRatio,
        originalImage.scene,
        params.userId,
        originalImage.id,
        originalImage.generationId,
        index
      )
    );

    const variations = await Promise.all(variationPromises);
    const successfulVariations = variations.filter(v => v !== null);

    return {
      success: true,
      variations: successfulVariations as Array<{
        id: string;
        imageUrl: string;
        prompt: string;
        aspectRatio: string;
        scene: string;
      }>
    };

  } catch (error) {
    console.error("Error generating image variations:", error);
    return {
      success: false,
      error: "Failed to generate variations"
    };
  }
}

/**
 * Upscale an existing product image
 */
export async function upscaleImage(params: UpscaleImageParams): Promise<ImageUpscaleResponse> {
  try {
    // Get the original image data
    const originalImage = await db.productImage.findUnique({
      where: { id: params.originalImageId }
    });

    if (!originalImage) {
      return {
        success: false,
        error: "Original image not found"
      };
    }

    // Generate upscaled image using OpenAI
    const upscaledImageData = await generateUpscaledImage(
      originalImage.prompt,
      originalImage.imageUrl,
      originalImage.aspectRatio,
      originalImage.scene,
      params.userId,
      originalImage.id,
      originalImage.generationId
    );

    if (!upscaledImageData) {
      return {
        success: false,
        error: "Failed to upscale image"
      };
    }

    return {
      success: true,
      upscaledImage: upscaledImageData
    };

  } catch (error) {
    console.error("Error upscaling image:", error);
    return {
      success: false,
      error: "Failed to upscale image"
    };
  }
}

/**
 * Generate variation prompts using OpenAI
 */
async function generateVariationPrompts(originalPrompt: string, numberOfVariations: number): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback variations without OpenAI
      return Array.from({ length: numberOfVariations }, (_, i) => 
        `${originalPrompt} - Variation ${i + 1} with slight creative differences`
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional product photography prompt specialist. Generate creative variations of product photography prompts while maintaining the core theme and quality."
          },
          {
            role: "user",
            content: `Create ${numberOfVariations} creative variations of this product photography prompt. Each variation should maintain the same core elements but introduce subtle creative differences in lighting, composition, props, or styling. Keep the professional quality and product focus consistent.

Original prompt: "${originalPrompt}"

Return only the variation prompts, one per line, without numbering or additional text.`
          }
        ],
        temperature: 0.8 + (Math.random() * 0.2), // 0.8 to 1.0 for high creativity, matching generateProductShots
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return content.split('\n').filter((line: string) => line.trim()).slice(0, numberOfVariations);

  } catch (error) {
    console.error("Error generating variation prompts:", error);
    // Fallback variations
    return Array.from({ length: numberOfVariations }, (_, i) => 
      `${originalPrompt} - Creative variation ${i + 1} with different styling approach`
    );
  }
}

/**
 * Generate a single variation using OpenAI Image Edit API
 * Now sends both the original product image and the generated image for better variations
 */
async function generateSingleVariation(
  prompt: string,
  sourceImageUrl: string,
  aspectRatio: string,
  scene: string,
  userId: string,
  originalImageId: string,
  generationId: string,
  index: number
): Promise<{
  id: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
  scene: string;
} | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback image");
      return null;
    }

    // Get the original image from the generation
    const generation = await db.generation.findUnique({
      where: { id: generationId }
    });

    if (!generation?.originalImageUrl) {
      console.error("Original image URL not found in generation");
      return null;
    }

    // Download both the source image and original product image
    const [sourceResponse, originalResponse] = await Promise.all([
      fetch(sourceImageUrl),
      fetch(generation.originalImageUrl)
    ]);

    const [sourceBuffer, originalBuffer] = await Promise.all([
      sourceResponse.arrayBuffer(),
      originalResponse.arrayBuffer()
    ]);
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    
    // Set size based on aspect ratio - support larger sizes like generateProductShots
    let size = '1024x1024';
    if (aspectRatio === '1536x1024') size = '1536x1024';
    if (aspectRatio === '1024x1536') size = '1024x1536';
    formData.append('size', size);
    
    // Add quality parameter to match generateProductShots
    let imageQuality = process.env.NODE_ENV === "production" ? "medium" : "low";
    formData.append('quality', imageQuality);
    
    // Add both images - original product image and the generated image to create variation from
    const originalImageBlob = new Blob([originalBuffer], { type: 'image/png' });
    const sourceImageBlob = new Blob([sourceBuffer], { type: 'image/png' });
    
    // formData.append('image', originalImageBlob, 'original.png');
    formData.append('image', sourceImageBlob, 'source.png');
    
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("OpenAI API error:", responseText);
      return null;
    }

    const data = JSON.parse(responseText) as { data: Array<{ url?: string, b64_json?: string }> };
    
    if (data.data && data.data[0]) {
      let imageData: string;
      
      if (data.data[0].url) {
        // Download the image and convert to base64
        const imageResponse = await fetch(data.data[0].url);
        const imageBuffer = await imageResponse.arrayBuffer();
        imageData = Buffer.from(imageBuffer).toString('base64');
      } else if (data.data[0].b64_json) {
        imageData = data.data[0].b64_json;
      } else {
        console.error("No image data in response");
        return null;
      }

      // Upload to Cloudinary
      const result = await uploadBase64ToCloudinary(imageData, {
        folder: 'ai-creatives/product-shots/variations',
        public_id: `variation-${scene}-${uuidv4()}`,
      });
      
      // Save to database
      const savedImage = await db.productImage.create({
        data: {
          userId,
          generationId, // Link to same generation
          prompt,
          aspectRatio,
          scene,
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          type: ProductImageType.Variation,
          originalImageUrl: sourceImageUrl,
          originalImagePublicId: originalImageId
        }
      });
      
      return {
        id: savedImage.id,
        imageUrl: savedImage.imageUrl,
        prompt: savedImage.prompt,
        aspectRatio: savedImage.aspectRatio,
        scene: savedImage.scene
      };
    }
    
    return null;
    
  } catch (error) {
    console.error(`Error generating variation ${index + 1}:`, error);
    return null;
  }
}

/**
 * Generate an upscaled image using OpenAI
 */
async function generateUpscaledImage(
  prompt: string,
  sourceImageUrl: string,
  aspectRatio: string,
  scene: string,
  userId: string,
  originalImageId: string,
  generationId: string
): Promise<{
  id: string;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
  scene: string;
} | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found");
      return null;
    }

    // Get the original image from the generation
    const generation = await db.generation.findUnique({
      where: { id: generationId }
    });

    if (!generation?.originalImageUrl) {
      console.error("Original image URL not found in generation");
      return null;
    }

    // Download both the source image and original product image
    const [sourceResponse, originalResponse] = await Promise.all([
      fetch(sourceImageUrl),
      fetch(generation.originalImageUrl)
    ]);

    const [sourceBuffer, originalBuffer] = await Promise.all([
      sourceResponse.arrayBuffer(),
      originalResponse.arrayBuffer()
    ]);
    
    // Create enhanced prompt for upscaling
    const upscalePrompt = `${prompt} - High resolution, ultra detailed, professional quality, sharp focus, enhanced clarity`;
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('model', 'gpt-image-1'); // Match generateProductShots.ts
    formData.append('prompt', upscalePrompt);
    formData.append('n', '1');
    
    // Set size based on aspect ratio - support larger sizes like generateProductShots
    let size = '1024x1024';
    if (aspectRatio === '1536x1024') size = '1536x1024';
    if (aspectRatio === '1024x1536') size = '1024x1536';
    formData.append('size', size);
    
    // Add quality parameter to match generateProductShots
    let imageQuality = "high";
    formData.append('quality', imageQuality);
    
    // Add both images - original product image and the generated image to upscale
    const originalImageBlob = new Blob([originalBuffer], { type: 'image/png' });
    const sourceImageBlob = new Blob([sourceBuffer], { type: 'image/png' });
    
    formData.append('image', originalImageBlob, 'original.png');
    
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("OpenAI API error:", responseText);
      return null;
    }

    const data = JSON.parse(responseText) as { data: Array<{ url?: string, b64_json?: string }> };
    
    if (data.data && data.data[0]) {
      let imageData: string;
      
      if (data.data[0].url) {
        // Download the image and convert to base64
        const imageResponse = await fetch(data.data[0].url);
        const imageBuffer = await imageResponse.arrayBuffer();
        imageData = Buffer.from(imageBuffer).toString('base64');
      } else if (data.data[0].b64_json) {
        imageData = data.data[0].b64_json;
      } else {
        console.error("No image data in response");
        return null;
      }

      // Upload to Cloudinary
      const result = await uploadBase64ToCloudinary(imageData, {
        folder: 'ai-creatives/product-shots/upscaled',
        public_id: `upscaled-${scene}-${uuidv4()}`,
      });
      
      // Save to database
      const savedImage = await db.productImage.create({
        data: {
          userId,
          generationId,
          prompt: upscalePrompt,
          aspectRatio,
          scene,
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          type: ProductImageType.Upscaled,
          originalImageUrl: sourceImageUrl,
          originalImagePublicId: originalImageId
        }
      });
      
      return {
        id: savedImage.id,
        imageUrl: savedImage.imageUrl,
        prompt: savedImage.prompt,
        aspectRatio: savedImage.aspectRatio,
        scene: savedImage.scene
      };
    }
    
    return null;
    
  } catch (error) {
    console.error("Error generating upscaled image:", error);
    return null;
  }
}
