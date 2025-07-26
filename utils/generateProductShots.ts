import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary, uploadBase64ToCloudinary } from '@/lib/cloudinary';
import { generateSceneDetails, buildScenePrompt, ScenePromptParams } from './scenePrompts';

export interface GeneratedProductImage {
  imageUrl: string;
  publicId: string;
  aspectRatio: string;
  scene: string;
}

export interface ProductShotGenerationResponse {
  generatedImages: GeneratedProductImage[];
  originalImage?: {
    url: string;
    publicId: string;
  };
}

export interface ProductShotParams {
  prompt: string;
  aspectRatio: string;
  scene: string;
  numberOfImages: number;
  productImage: File;
  similarImages?: File[];
}

/**
 * Save the uploaded product image to Cloudinary
 */
async function saveProductImageToCloudinary(file: File): Promise<{
  url: string;
  publicId: string;
}> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Upload to Cloudinary
  const result = await uploadToCloudinary(buffer, {
    folder: 'ai-creatives/product-shots',
    public_id: `product-${uuidv4()}`,
  });
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Generate product shots using OpenAI Image Edit API
 * Each image gets a unique, creative scene details to ensure visual diversity
 */
export async function generateProductShots(params: ProductShotParams): Promise<ProductShotGenerationResponse> {
  try {
    console.log("Generating product shots...", params);

    // Save original image to Cloudinary
    const originalImageData = await saveProductImageToCloudinary(params.productImage);

    // Generate unique scene details for each image to ensure visual diversity
    const generationPromises = Array.from({ length: params.numberOfImages }, (_, index) => 
      generateSingleProductShotWithUniqueScene(params, originalImageData.url, index)
    );

    const generatedImages = await Promise.all(generationPromises);

    return {
      generatedImages: generatedImages.filter((img): img is GeneratedProductImage => img !== null),
      originalImage: originalImageData
    };

  } catch (error) {
    console.error("Error generating product shots:", error);
    
    // Return dummy images in case of error
    return {
      generatedImages: getDummyProductImages(params),
      originalImage: undefined
    };
  }
}

/**
 * Generate a single product shot with unique scene details for visual diversity
 * Each image gets its own creative scene interpretation
 */
async function generateSingleProductShotWithUniqueScene(
  params: ProductShotParams,
  sourceImageUrl: string,
  index: number
): Promise<GeneratedProductImage | null> {
  try {
    console.log(`Generating unique product shot ${index + 1}...`);
    
    // Step 1: Generate unique scene details for this specific image
    // Add variation prompts to ensure each image is different
    const variationPrompts = [
      "with a completely different creative approach",
      "using an alternative color scheme and styling",
      "with unique props and different lighting mood", 
      "from a fresh creative perspective with new elements",
      "featuring distinct materials and atmosphere",
      "with innovative styling and creative composition",
      "using contrasting elements and fresh visual approach",
      "with unique artistic interpretation and different ambiance"
    ];
    
    const variationPrompt = variationPrompts[index % variationPrompts.length];
    const enhancedPrompt = `${params.prompt} ${variationPrompt}. Make this visually distinct from other product shots.`;
    
    const sceneDetails = await generateSceneDetails({
      userPrompt: enhancedPrompt,
      scene: params.scene,
      aspectRatio: params.aspectRatio
    });

    console.log(`Generated unique scene details for image ${index + 1}:`, sceneDetails);

    // Step 2: Build the complete prompt using the unique scene details
    const fullPrompt = buildScenePrompt(sceneDetails, params.scene, enhancedPrompt);

    console.log(`Full unique prompt for image ${index + 1}:`, fullPrompt);

    // Step 3: Generate the image using the unique prompt
    return await generateSingleProductShot(fullPrompt, params.aspectRatio, params.scene, sourceImageUrl, index);

  } catch (error) {
    console.error(`Error generating unique product shot ${index + 1}:`, error);
    return useFallbackProductImage(params.aspectRatio, params.scene, index);
  }
}

/**
 * Generate a single product shot using OpenAI Image Edit API
 */
async function generateSingleProductShot(
  prompt: string, 
  aspectRatio: string,
  scene: string,
  sourceImageUrl: string,
  index: number
): Promise<GeneratedProductImage | null> {
  try {
    console.log(`Generating product shot ${index + 1}...`);
    
    // Check if we have an OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using fallback image");
      return useFallbackProductImage(aspectRatio, scene, index);
    }

    // Download the source image
    const imageResponse = await fetch(sourceImageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('model', 'gpt-image-1'); 
    formData.append('prompt', prompt);
    formData.append('n', '1');
    
    // Set size based on aspect ratio
    let size = '1024x1024';
    if (aspectRatio === '1536x1024') size = '1536x1024';
    if (aspectRatio === '1024x1536') size = '1024x1536';
    formData.append('size', size);
    
    // let imageQuality = 'medium';
    let imageQuality = process.env.NODE_ENV === "production" ? "medium" : "low";
    formData.append('quality', imageQuality);
    
    // Add the image buffer
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image', imageBlob, 'image.png');
    
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
      return useFallbackProductImage(aspectRatio, scene, index);
    }

    const data = JSON.parse(responseText) as { data: Array<{ url?: string, b64_json?: string }> };
    
    if (data.data && data.data[0]) {
      let imageData: string;
      
      if (data.data[0].url) {
        // Download image from URL and convert to base64
        const imgResponse = await fetch(data.data[0].url);
        const imgBuffer = await imgResponse.arrayBuffer();
        imageData = Buffer.from(imgBuffer).toString('base64');
      } else if (data.data[0].b64_json) {
        imageData = data.data[0].b64_json;
      } else {
        console.error("No image data in response");
        return useFallbackProductImage(aspectRatio, scene, index);
      }
      
      // Upload to Cloudinary
      const result = await uploadBase64ToCloudinary(imageData, {
        folder: 'ai-creatives/product-shots',
        public_id: `product-shot-${scene}-${uuidv4()}`,
      });
      
      return {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        aspectRatio,
        scene
      };
    } else {
      console.error("No image data in response");
      return useFallbackProductImage(aspectRatio, scene, index);
    }
    
  } catch (error) {
    console.error(`Error generating product shot ${index + 1}:`, error);
    return useFallbackProductImage(aspectRatio, scene, index);
  }
}

/**
 * Use a fallback image when OpenAI API fails
 */
async function useFallbackProductImage(aspectRatio: string, scene: string, index: number): Promise<GeneratedProductImage> {
  const fallbackUrls = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1560472355-536de3962603",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f"
  ];
  
  const placeholderUrl = fallbackUrls[index % fallbackUrls.length];
  
  try {
    // Download the placeholder image
    const response = await fetch(placeholderUrl);
    const buffer = await response.arrayBuffer();
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(Buffer.from(buffer), {
      folder: 'ai-creatives/product-shots',
      public_id: `fallback-product-shot-${scene}-${uuidv4()}`,
    });
    
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      aspectRatio,
      scene
    };
  } catch (error) {
    console.error("Error uploading fallback image:", error);
    return {
      imageUrl: `https://via.placeholder.com/${aspectRatio.replace('x', 'x')}/f0f0f0/999999?text=Product+Shot`,
      publicId: `fallback-${uuidv4()}`,
      aspectRatio,
      scene
    };
  }
}

/**
 * Get dummy images in case of error
 */
function getDummyProductImages(params: ProductShotParams): GeneratedProductImage[] {
  return Array.from({ length: params.numberOfImages }, (_, index) => ({
    imageUrl: `https://via.placeholder.com/${params.aspectRatio.replace('x', 'x')}/f0f0f0/999999?text=Product+Shot+${index + 1}`,
    publicId: `dummy-product-shot-${index + 1}-${uuidv4()}`,
    aspectRatio: params.aspectRatio,
    scene: params.scene
  }));
}
