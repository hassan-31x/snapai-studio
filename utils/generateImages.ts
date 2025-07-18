import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { imagePrompts, fallbackPrompt } from './imagePrompts';
import { CreativeAssetsResponse } from './generateCreativeAssets';
import { uploadToCloudinary, uploadBase64ToCloudinary } from '@/lib/cloudinary';

// Define the type for the image generation result
export interface GeneratedImage {
  type: string;
  title: string;
  imageUrl: string;
  dimensions: string;
  assetDetails: any;
  publicId: string;
}

// Type for the complete response including original image
export interface ImageGenerationResponse {
  generatedImages: GeneratedImage[];
  originalImage?: {
    url: string;
    publicId: string;
  };
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
    folder: 'ai-creatives/products',
    public_id: `product-${uuidv4()}`,
  });
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Generate images based on creative assets using OpenAI API
 */
export async function generateImages(
  creativeAssets: CreativeAssetsResponse, 
  productData: any = {},
  productImage?: File | null
): Promise<ImageGenerationResponse> {
  try {
    console.log("Generating images from creative assets...");
    
    // Map asset types to our frontend image types
    const assetTypeMapping: { [key: string]: { type: string, dimensions: string } } = {
      "Instagram Post": { type: "instagram_post", dimensions: "1080 × 1080" },
      "Instagram Story": { type: "instagram_story", dimensions: "1080 × 1920" },
      "Website Banner": { type: "website_banner", dimensions: "1200 × 400" },
      "Ad Creative": { type: "facebook_post", dimensions: "1200 × 630" },
      "Testimonial Graphic": { type: "linkedin_post", dimensions: "1200 × 627" }
    };
    
    // Save product image to Cloudinary if available
    let originalImageData: { url: string; publicId: string } | undefined = undefined;
    if (productImage && productImage instanceof File) {
      originalImageData = await saveProductImageToCloudinary(productImage);
      console.log("Product image uploaded to Cloudinary:", originalImageData.url);
    }
    
    // Process each asset and generate an image
    const generatedImages = await Promise.all(
      creativeAssets.assets.map(async (asset) => {
        const assetType = asset.assetType;
        const mappedAsset = assetTypeMapping[assetType] || { 
          type: "other", 
          dimensions: "1000 × 1000" 
        };
        
        // Get the prompt for this asset type from our imagePrompts
        let prompt;
        if (imagePrompts[assetType as keyof typeof imagePrompts]) {
          // Use the real prompt function with asset details and product data
          const promptFn = imagePrompts[assetType as keyof typeof imagePrompts];
          prompt = promptFn(asset, productData);
        } else {
          // Fallback to dummy prompts if asset type not found
          prompt = fallbackPrompt;
        }
        
        // Generate the image with OpenAI and upload to Cloudinary
        const imageResult = await generateImageWithOpenAI(
          prompt, 
          mappedAsset.type,
          originalImageData?.url
        );
        
        return {
          type: mappedAsset.type,
          title: assetType,
          imageUrl: imageResult.url,
          dimensions: mappedAsset.dimensions,
          assetDetails: asset,
          publicId: imageResult.publicId
        };
      })
    );
    
    console.log("Generated images:", generatedImages);
    
    return {
      generatedImages,
      originalImage: originalImageData
    };
    
  } catch (error) {
    console.error("Error generating images:", error);
    // Return dummy images in case of error
    return {
      generatedImages: getDummyImages(creativeAssets),
      originalImage: undefined
    };
  }
}

/**
 * Generate an image using OpenAI and upload to Cloudinary
 */
async function generateImageWithOpenAI(
  prompt: string, 
  imageType: string,
  sourceImageUrl?: string
): Promise<{ url: string; publicId: string }> {
  try {
    console.log(`Generating image for ${imageType} with OpenAI...`);
    
    // Check if we have an OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OpenAI API key found, using fallback images");
      return useFallbackImage(imageType);
    }
    
    // If no source image provided, use image generation API
    if (!sourceImageUrl) {
      return generateImageWithoutSource(prompt, imageType);
    }
    
    // Use OpenAI Image Edit API with source image
    return generateImageWithSource(prompt, imageType, sourceImageUrl);
    
  } catch (error) {
    console.error(`Error generating image for ${imageType}:`, error);
    // Return a fallback image
    return useFallbackImage(imageType);
  }
}

/**
 * Generate image using standard OpenAI image generation API and upload to Cloudinary
 */
async function generateImageWithoutSource(
  prompt: string,
  imageType: string
): Promise<{ url: string; publicId: string }> {
  console.log(`Using standard image generation API for ${imageType}...`);
  
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    console.error("OpenAI API error:", responseText);
    return useFallbackImage(imageType);
  }

  const data = JSON.parse(responseText) as { data: Array<{ b64_json: string }> };
  
  if (data.data && data.data[0] && data.data[0].b64_json) {
    const base64Data = data.data[0].b64_json;
    
    // Upload to Cloudinary
    const result = await uploadBase64ToCloudinary(base64Data, {
      folder: 'ai-creatives/generated',
      public_id: `${imageType}-${uuidv4()}`,
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } else {
    console.error("No base64 image data in response");
    return useFallbackImage(imageType);
  }
}

/**
 * Generate image using OpenAI Image Edit API with source image and upload to Cloudinary
 */
async function generateImageWithSource(
  prompt: string,
  imageType: string,
  sourceImageUrl: string
): Promise<{ url: string; publicId: string }> {
  console.log(`Using image edit API for ${imageType} with source image...`);
  
  // Download the source image from Cloudinary
  const imageResponse = await fetch(sourceImageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  
  // Create form data for the API request
  let imageQuality = process.env.NODE_ENV === "production" ? "medium" : "low";
  const formData = new FormData();
  formData.append('model', 'gpt-image-1'); // Image edit only supports dall-e-2
  formData.append('prompt', prompt);
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  formData.append('quality', imageQuality);

  
  // Add the image buffer
  formData.append('image', Buffer.from(imageBuffer), {
    filename: 'image.png',
    contentType: 'image/png',
  });
  
  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders()
    },
    body: formData as any
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    console.error("OpenAI API error:", responseText);
    return useFallbackImage(imageType);
  }

  const data = JSON.parse(responseText) as { data: Array<{ b64_json: string }> };
  
  if (data.data && data.data[0] && data.data[0].b64_json) {
    const base64Data = data.data[0].b64_json;
    
    // Upload to Cloudinary
    const result = await uploadBase64ToCloudinary(base64Data, {
      folder: 'ai-creatives/generated',
      public_id: `${imageType}-${uuidv4()}`,
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } else {
    console.error("No base64 image data in response");
    return useFallbackImage(imageType);
  }
}

/**
 * Use a fallback image when OpenAI API fails or is not available
 */
async function useFallbackImage(imageType: string): Promise<{ url: string; publicId: string }> {
  // For development, we'll use placeholder images from Unsplash and upload them to Cloudinary
  const unsplashUrls: { [key: string]: string } = {
    "instagram_post": "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f",
    "instagram_story": "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
    "facebook_post": "https://images.unsplash.com/photo-1611605698335-8b1569810432",
    "linkedin_post": "https://images.unsplash.com/photo-1560472355-536de3962603",
    "website_banner": "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "other": "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb"
  };
  
  try {
    const placeholderUrl = unsplashUrls[imageType] || unsplashUrls.other;
    
    // Download the placeholder image
    const response = await fetch(placeholderUrl);
    const imageBuffer = await response.arrayBuffer();
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(Buffer.from(imageBuffer), {
      folder: 'ai-creatives/fallback',
      public_id: `fallback-${imageType}-${uuidv4()}`,
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error using fallback image:", error);
    
    // Return a default Cloudinary placeholder URL
    const publicId = `fallback-${imageType}-${uuidv4()}`;
    return {
      url: `https://via.placeholder.com/400x400/f0f0f0/999999?text=${imageType}`,
      publicId,
    };
  }
}

/**
 * Get dummy images in case of error
 */
function getDummyImages(creativeAssets: CreativeAssetsResponse): GeneratedImage[] {
  return [
    {
      type: "instagram_post",
      title: "Instagram Post",
      imageUrl: "https://via.placeholder.com/1080x1080/f0f0f0/999999?text=Instagram+Post",
      dimensions: "1080 × 1080",
      assetDetails: creativeAssets.assets.find(asset => asset.assetType === "Instagram Post"),
      publicId: `dummy-instagram-post-${uuidv4()}`
    },
    {
      type: "instagram_story",
      title: "Instagram Story",
      imageUrl: "https://via.placeholder.com/1080x1920/f0f0f0/999999?text=Instagram+Story",
      dimensions: "1080 × 1920",
      assetDetails: creativeAssets.assets.find(asset => asset.assetType === "Instagram Story"),
      publicId: `dummy-instagram-story-${uuidv4()}`
    },
    {
      type: "facebook_post",
      title: "Facebook Post",
      imageUrl: "https://via.placeholder.com/1200x630/f0f0f0/999999?text=Facebook+Post",
      dimensions: "1200 × 630",
      assetDetails: creativeAssets.assets.find(asset => asset.assetType === "Ad Creative"),
      publicId: `dummy-facebook-post-${uuidv4()}`
    },
    {
      type: "linkedin_post",
      title: "LinkedIn Post",
      imageUrl: "https://via.placeholder.com/1200x627/f0f0f0/999999?text=LinkedIn+Post",
      dimensions: "1200 × 627",
      assetDetails: creativeAssets.assets.find(asset => asset.assetType === "Testimonial Graphic"),
      publicId: `dummy-linkedin-post-${uuidv4()}`
    },
    {
      type: "website_banner",
      title: "Website Banner",
      imageUrl: "https://via.placeholder.com/1200x400/f0f0f0/999999?text=Website+Banner",
      dimensions: "1200 × 400",
      assetDetails: creativeAssets.assets.find(asset => asset.assetType === "Website Banner"),
      publicId: `dummy-website-banner-${uuidv4()}`
    }
  ];
}
