"use server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PromptAssistantParams {
  productName: string;
  productType: string;
  productStyle: string;
  setting: string;
  mood: string;
  keyFeatures: string;
}

export interface PromptAssistantResponse {
  success: boolean;
  prompt?: string;
  error?: string;
}

export interface PromptEnhancementResponse {
  success: boolean;
  enhancedPrompt?: string;
  error?: string;
}

/**
 * Generate a detailed product shot prompt based on user inputs
 */
export async function generatePromptAssistance(params: PromptAssistantParams): Promise<PromptAssistantResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured"
      };
    }

    const systemPrompt = `You are a professional product photography prompt specialist. Your task is to create detailed, specific prompts for AI image generation that will result in stunning product shots.

Based on the user's inputs, generate a comprehensive prompt that includes:
- Specific visual details about the product presentation
- Professional photography terminology
- Lighting and composition specifics
- Mood and atmosphere descriptions
- Technical quality requirements

Make the prompt detailed enough to generate high-quality, professional product photography, but concise enough to be effective for AI image generation.`;

    const userPrompt = `Create a detailed product shot prompt based on these specifications:

Product Name/Description: ${params.productName}
Product Type: ${params.productType}
Product Style: ${params.productStyle}
Setting/Environment: ${params.setting}
Desired Mood: ${params.mood}
Key Features to Highlight: ${params.keyFeatures}

Generate a comprehensive prompt that would create a professional product photograph showcasing these elements. Focus on visual details, lighting, composition, and professional photography quality. Use the specific product name/description to make the prompt more targeted and relevant.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return {
      success: true,
      prompt: content.trim()
    };

  } catch (error) {
    console.error("Error generating prompt assistance:", error);
    return {
      success: false,
      error: "Failed to generate prompt assistance"
    };
  }
}

/**
 * Enhance an existing prompt with more detail and professional terminology
 */
export async function enhancePrompt(originalPrompt: string): Promise<PromptEnhancementResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured"
      };
    }

    if (!originalPrompt || originalPrompt.trim().length < 10) {
      return {
        success: false,
        error: "Prompt must be at least 10 characters long"
      };
    }

    const systemPrompt = `You are a professional product photography expert specializing in creating detailed prompts for AI image generation.

Your task is to enhance user prompts by:
- Adding professional photography terminology
- Including specific lighting and composition details
- Enhancing visual descriptions with professional language
- Adding technical quality specifications
- Maintaining the original intent while making it more detailed and specific

Keep the enhanced prompt clear, detailed, and optimized for AI image generation. Focus on visual elements that will improve the final product shot quality.`;

    const userPrompt = `Enhance this product shot prompt with professional photography details and specifications:

Original prompt: "${originalPrompt}"

Make it more detailed and professional while keeping the core intent. Add specific lighting, composition, and technical details that would result in a higher quality product photograph.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return {
      success: true,
      enhancedPrompt: content.trim()
    };

  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return {
      success: false,
      error: "Failed to enhance prompt"
    };
  }
}
