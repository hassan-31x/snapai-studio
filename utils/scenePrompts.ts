import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SceneDetails {
  backgroundTone: string;
  surfaceType: string;
  accentProp: string;
  lighting: string;
  cameraAngle: string;
  colorPalette: string;
  mood: string;
  additionalElements: string;
}

export interface ScenePromptParams {
  userPrompt: string;
  scene: string;
  aspectRatio: string;
}

/**
 * Generate scene details using OpenAI based on user prompt and scene type
 * Now includes temperature variation and creativity boosters for unique outputs
 */
export async function generateSceneDetails(params: ScenePromptParams): Promise<SceneDetails> {
  try {
    const systemPrompt = `You are a professional product photographer and stylist specializing in high-end commercial photography.

Your task is to analyze a user's product shot request and generate specific styling details for a ${params.scene} scene.

Consider the aspect ratio: ${params.aspectRatio} - this affects composition and framing.

IMPORTANT: Be highly creative and unique in your approach. Each response should offer a distinctly different visual interpretation, even for similar requests. Think outside conventional approaches and surprise with fresh creative ideas.

Return a JSON object with specific, actionable styling details that will create a cohesive, professional product shot.

Focus on:
- Specific background materials, textures, and tones (be creative with unusual combinations)
- Precise surface materials and positioning (think beyond standard surfaces)
- Complementary props that enhance without overwhelming (unique, unexpected choices)
- Professional lighting setup details (experiment with dramatic or creative lighting)
- Camera angle and composition approach (try unconventional but effective angles)
- Color palette that works harmoniously (bold, unique color combinations)
- Overall mood and atmosphere (create distinctive emotional tones)
- Additional elements that support the scene (surprise elements that enhance the story)

Make everything specific, professional, and creatively unique - avoid generic or repetitive approaches.`;

    const userPrompt = `User's product shot request: "${params.userPrompt}"
Scene type: ${params.scene}
Aspect ratio: ${params.aspectRatio}

Generate specific styling details for this ${params.scene} product shot in this exact JSON format:

{
  "backgroundTone": "Specific background description with materials and colors",
  "surfaceType": "Exact surface material and positioning details",
  "accentProp": "Specific prop with placement details",
  "lighting": "Detailed lighting setup with direction and quality",
  "cameraAngle": "Precise camera positioning and angle",
  "colorPalette": "Specific color scheme with hex codes if possible",
  "mood": "Overall atmosphere and emotional tone",
  "additionalElements": "Supporting elements and styling details"
}`;

    // Use higher temperature for more creative and diverse outputs
    const creativityTemperature = 0.8 + (Math.random() * 0.2); // 0.8 to 1.0 for high creativity

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: creativityTemperature,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON response
    const sceneDetails = JSON.parse(content) as SceneDetails;
    return sceneDetails;
  } catch (error) {
    console.error("Error generating scene details:", error);
    // Return fallback scene details with some randomization
    return getFallbackSceneDetailsWithVariation(params.scene);
  }
}

/**
 * Generate the complete prompt using scene details and scene-specific templates
 */
export function buildScenePrompt(sceneDetails: SceneDetails, scene: string, userPrompt: string): string {
  const sceneTemplate = sceneTemplates[scene as keyof typeof sceneTemplates];
  return sceneTemplate(sceneDetails, userPrompt);
}

/**
 * Scene-specific prompt templates with variable injection
 */
const sceneTemplates = {
  studio: (details: SceneDetails, userPrompt: string) => `
    Create a professional studio product photograph. ${userPrompt}.
    
    BACKGROUND: ${details.backgroundTone}. The studio setup should feel clean and commercial-grade.
    
    SURFACE: Position the product on ${details.surfaceType}. Ensure perfect product placement with no shadows or reflections that distract.
    
    PROPS: Include ${details.accentProp} strategically placed to enhance the composition without overwhelming the product focus.
    
    LIGHTING: Professional studio lighting setup with ${details.lighting}. Use softboxes, key lights, and fill lights to eliminate harsh shadows while maintaining dimension.
    
    CAMERA: Shot from ${details.cameraAngle} to capture the product's best features and maintain commercial photography standards.
    
    COLOR PALETTE: ${details.colorPalette} - ensure all elements work harmoniously within this color scheme.
    
    MOOD: ${details.mood} - this should feel professional, clean, and commercial-ready.
    
    ADDITIONAL STYLING: ${details.additionalElements}
    
    Technical requirements: High resolution, sharp focus, professional color grading, commercial photography quality, no visible studio equipment.
  `,

  outdoor: (details: SceneDetails, userPrompt: string) => `
    Create an outdoor product photograph in a natural setting. ${userPrompt}.
    
    ENVIRONMENT: ${details.backgroundTone}. The outdoor setting should feel organic and naturally lit.
    
    SURFACE: Place the product on ${details.surfaceType} that fits naturally in the outdoor environment.
    
    NATURAL ELEMENTS: Incorporate ${details.accentProp} as natural elements that complement the outdoor setting.
    
    LIGHTING: Natural outdoor lighting with ${details.lighting}. Utilize golden hour, soft daylight, or natural shade to create appealing illumination.
    
    COMPOSITION: Captured from ${details.cameraAngle} to show both the product and its natural environment context.
    
    COLOR HARMONY: ${details.colorPalette} - colors should feel natural and harmonious with the outdoor environment.
    
    ATMOSPHERE: ${details.mood} - evoke a sense of natural beauty and outdoor lifestyle.
    
    SCENE DETAILS: ${details.additionalElements}
    
    Style: Natural, organic, lifestyle photography, environmental context, authentic outdoor feeling.
  `,

  luxury: (details: SceneDetails, userPrompt: string) => `
    Create an ultra-luxury product photograph with premium materials and sophisticated styling. ${userPrompt}.
    
    LUXURY BACKGROUND: ${details.backgroundTone}. Every element should exude premium quality and sophistication.
    
    PREMIUM SURFACE: Product positioned on ${details.surfaceType} - use only the finest materials like marble, silk, gold, crystal, or premium woods.
    
    LUXURY PROPS: Feature ${details.accentProp} as luxury accent pieces that elevate the entire composition.
    
    SOPHISTICATED LIGHTING: ${details.lighting} creating dramatic, elegant illumination that highlights texture and premium materials.
    
    ELEGANT FRAMING: Shot from ${details.cameraAngle} with sophisticated composition befitting luxury brand standards.
    
    PREMIUM PALETTE: ${details.colorPalette} - rich, sophisticated colors that convey luxury and exclusivity.
    
    LUXURY MOOD: ${details.mood} - sophisticated, exclusive, aspirational, and undeniably premium.
    
    LUXURY DETAILS: ${details.additionalElements}
    
    Execution: Museum-quality photography, impeccable styling, luxury brand standards, premium materials only, sophisticated color grading.
  `,

  minimal: (details: SceneDetails, userPrompt: string) => `
    Create a minimalist product photograph with clean lines and deliberate simplicity. ${userPrompt}.
    
    MINIMAL BACKGROUND: ${details.backgroundTone}. Embrace negative space and clean, uncluttered compositions.
    
    CLEAN SURFACE: Product placed on ${details.surfaceType} with careful attention to geometric alignment and spacing.
    
    PURPOSEFUL ELEMENTS: ${details.accentProp} used sparingly and with intention - every element must serve a purpose.
    
    SOFT LIGHTING: ${details.lighting} that creates subtle shadows and gentle dimension without drama.
    
    GEOMETRIC FRAMING: ${details.cameraAngle} emphasizing clean lines, balance, and geometric composition.
    
    NEUTRAL PALETTE: ${details.colorPalette} - restrained, neutral colors that support the minimalist aesthetic.
    
    SERENE MOOD: ${details.mood} - calm, peaceful, focused, and intentionally simple.
    
    MINIMAL DETAILS: ${details.additionalElements}
    
    Philosophy: Less is more, intentional spacing, geometric balance, premium simplicity, Scandinavian influence.
  `,

  lifestyle: (details: SceneDetails, userPrompt: string) => `
    Create an authentic lifestyle product photograph showing real-world usage. ${userPrompt}.
    
    LIFESTYLE SETTING: ${details.backgroundTone}. The environment should feel lived-in and authentically human.
    
    NATURAL PLACEMENT: Product integrated into ${details.surfaceType} in a way that feels natural and unforced.
    
    LIFESTYLE PROPS: ${details.accentProp} that support the authentic lifestyle narrative and context.
    
    NATURAL LIGHTING: ${details.lighting} that feels authentic to the environment - window light, natural illumination.
    
    CANDID PERSPECTIVE: ${details.cameraAngle} that captures the scene as if naturally observed in daily life.
    
    AUTHENTIC COLORS: ${details.colorPalette} - real-world colors that feel natural and unfiltered.
    
    RELATABLE MOOD: ${details.mood} - approachable, authentic, relatable, and genuinely human.
    
    LIFESTYLE CONTEXT: ${details.additionalElements}
    
    Approach: Documentary-style, authentic moments, natural integration, lifestyle storytelling, relatable scenarios.
  `,

  artistic: (details: SceneDetails, userPrompt: string) => `
    Create an artistic product photograph with creative expression and visual impact. ${userPrompt}.
    
    ARTISTIC BACKGROUND: ${details.backgroundTone}. Push creative boundaries while maintaining product focus.
    
    CREATIVE SURFACE: Product interacts with ${details.surfaceType} in innovative and visually striking ways.
    
    ARTISTIC ELEMENTS: ${details.accentProp} used as creative elements that enhance the artistic narrative.
    
    DRAMATIC LIGHTING: ${details.lighting} creating bold contrasts, interesting shadows, and artistic illumination.
    
    CREATIVE ANGLE: ${details.cameraAngle} that offers unique perspective and visual interest.
    
    BOLD PALETTE: ${details.colorPalette} - creative use of color to enhance artistic expression.
    
    EXPRESSIVE MOOD: ${details.mood} - bold, creative, emotionally engaging, and artistically compelling.
    
    ARTISTIC VISION: ${details.additionalElements}
    
    Style: Creative photography, artistic expression, visual storytelling, innovative composition, museum-worthy aesthetic.
  `,

  industrial: (details: SceneDetails, userPrompt: string) => `
    Create an industrial product photograph with urban materials and modern architecture. ${userPrompt}.
    
    INDUSTRIAL SETTING: ${details.backgroundTone}. Incorporate concrete, steel, and urban architectural elements.
    
    URBAN SURFACE: Product positioned on ${details.surfaceType} featuring industrial materials and textures.
    
    INDUSTRIAL PROPS: ${details.accentProp} that complement the urban industrial aesthetic.
    
    ARCHITECTURAL LIGHTING: ${details.lighting} that highlights industrial textures and creates urban atmosphere.
    
    URBAN PERSPECTIVE: ${details.cameraAngle} emphasizing the architectural and industrial context.
    
    INDUSTRIAL PALETTE: ${details.colorPalette} - concrete grays, steel blues, urban tones, and modern colors.
    
    URBAN MOOD: ${details.mood} - modern, sophisticated, architectural, and industrially refined.
    
    INDUSTRIAL DETAILS: ${details.additionalElements}
    
    Aesthetic: Modern architecture, industrial design, urban sophistication, contemporary materials, city-inspired styling.
  `,

  nature: (details: SceneDetails, userPrompt: string) => `
    Create a nature-inspired product photograph with organic elements and earth tones. ${userPrompt}.
    
    NATURAL BACKGROUND: ${details.backgroundTone}. Incorporate organic textures, natural materials, and earth elements.
    
    ORGANIC SURFACE: Product nestled in ${details.surfaceType} using natural materials like wood, stone, or organic textures.
    
    BOTANICAL ELEMENTS: ${details.accentProp} featuring plants, flowers, natural fibers, or organic materials.
    
    NATURAL ILLUMINATION: ${details.lighting} mimicking natural light patterns and organic shadow play.
    
    ORGANIC COMPOSITION: ${details.cameraAngle} that flows naturally and connects with organic forms.
    
    EARTH PALETTE: ${details.colorPalette} - natural earth tones, botanical greens, organic colors from nature.
    
    NATURAL MOOD: ${details.mood} - organic, peaceful, connected to nature, sustainably conscious.
    
    NATURAL HARMONY: ${details.additionalElements}
    
    Philosophy: Biomimicry, sustainable aesthetic, natural beauty, organic forms, earth-conscious styling.
  `
};

/**
 * Fallback scene details when OpenAI is unavailable
 * Now includes variation to ensure uniqueness
 */
function getFallbackSceneDetailsWithVariation(scene: string): SceneDetails {
  const baseDetails = getFallbackSceneDetails(scene);
  
  // Add randomization to create variations
  const variations = {
    backgroundVariations: [
      "with subtle texture overlay",
      "featuring gradient transitions", 
      "with geometric pattern elements",
      "incorporating organic textures",
      "with architectural elements"
    ],
    surfaceVariations: [
      "with brushed finish",
      "featuring reflective properties",
      "with matte texture treatment",
      "incorporating natural grain",
      "with geometric edge details"
    ],
    propVariations: [
      "positioned asymmetrically",
      "with complementary materials",
      "featuring contrasting textures",
      "in layered composition",
      "with dramatic scale variation"
    ],
    lightingVariations: [
      "with colored gel accents",
      "featuring dramatic shadows",
      "with soft diffusion effects",
      "incorporating rim lighting",
      "with directional highlights"
    ]
  };

  const randomIndex = Math.floor(Math.random() * 5);
  
  return {
    ...baseDetails,
    backgroundTone: `${baseDetails.backgroundTone} ${variations.backgroundVariations[randomIndex]}`,
    surfaceType: `${baseDetails.surfaceType} ${variations.surfaceVariations[randomIndex]}`,
    accentProp: `${baseDetails.accentProp} ${variations.propVariations[randomIndex]}`,
    lighting: `${baseDetails.lighting} ${variations.lightingVariations[randomIndex]}`
  };
}

/**
 * Fallback scene details when OpenAI is unavailable
 */
function getFallbackSceneDetails(scene: string): SceneDetails {
  const fallbacks: { [key: string]: SceneDetails } = {
    studio: {
      backgroundTone: "Clean white seamless background with subtle gray gradient",
      surfaceType: "Matte white acrylic platform with soft edges",
      accentProp: "Single geometric accent piece in brushed aluminum",
      lighting: "Three-point lighting with softbox key light and rim lighting",
      cameraAngle: "Slightly elevated 45-degree angle for optimal product visibility",
      colorPalette: "Neutral whites, soft grays, and clean metallics",
      mood: "Professional, clean, and commercial-ready",
      additionalElements: "Minimal shadows, perfect product placement, commercial standards"
    },
    outdoor: {
      backgroundTone: "Natural outdoor setting with soft bokeh background",
      surfaceType: "Weathered wood surface or natural stone platform",
      accentProp: "Organic elements like dried flowers or natural textures",
      lighting: "Soft natural daylight with gentle side illumination",
      cameraAngle: "Eye-level perspective with natural environmental context",
      colorPalette: "Earth tones, natural greens, and warm sunlight colors",
      mood: "Natural, organic, and environmentally connected",
      additionalElements: "Natural textures, environmental context, organic feel"
    },
    luxury: {
      backgroundTone: "Rich velvet or silk background in deep jewel tones",
      surfaceType: "Polished marble or gold-leafed surface",
      accentProp: "Precious metal accents or crystal elements",
      lighting: "Dramatic key lighting with elegant rim lights",
      cameraAngle: "Sophisticated three-quarter view with premium framing",
      colorPalette: "Rich golds, deep blues, elegant blacks, and premium metallics",
      mood: "Sophisticated, exclusive, and undeniably premium",
      additionalElements: "Luxury materials, impeccable styling, museum quality"
    },
    minimal: {
      backgroundTone: "Pure white or soft neutral backdrop with clean lines",
      surfaceType: "Simple geometric platform in matte finish",
      accentProp: "Single purposeful geometric element",
      lighting: "Soft, even illumination with minimal shadows",
      cameraAngle: "Clean, straight-on or slightly angled geometric view",
      colorPalette: "Neutral whites, soft grays, and understated tones",
      mood: "Calm, purposeful, and elegantly simple",
      additionalElements: "Negative space, geometric balance, intentional simplicity"
    },
    lifestyle: {
      backgroundTone: "Authentic home environment with natural textures",
      surfaceType: "Real-world surface like kitchen counter or living space",
      accentProp: "Everyday objects that create authentic context",
      lighting: "Natural window light or ambient home lighting",
      cameraAngle: "Candid perspective as if naturally observed",
      colorPalette: "Real-world colors, natural tones, authentic palettes",
      mood: "Relatable, authentic, and genuinely human",
      additionalElements: "Lifestyle context, authentic placement, natural integration"
    },
    artistic: {
      backgroundTone: "Creative backdrop with interesting textures or patterns",
      surfaceType: "Unusual or creative surface that adds visual interest",
      accentProp: "Artistic elements that enhance creative narrative",
      lighting: "Dramatic or creative lighting with bold contrasts",
      cameraAngle: "Unique perspective that creates visual impact",
      colorPalette: "Bold or creative color combinations",
      mood: "Creative, expressive, and artistically compelling",
      additionalElements: "Creative elements, artistic expression, visual storytelling"
    },
    industrial: {
      backgroundTone: "Concrete or metal textures with urban architectural elements",
      surfaceType: "Industrial materials like steel, concrete, or urban surfaces",
      accentProp: "Industrial elements like metal pipes or architectural details",
      lighting: "Stark industrial lighting with strong directional sources",
      cameraAngle: "Architectural perspective emphasizing industrial context",
      colorPalette: "Concrete grays, steel blues, industrial metallics",
      mood: "Modern, urban, and industrially sophisticated",
      additionalElements: "Urban textures, architectural elements, modern materials"
    },
    nature: {
      backgroundTone: "Natural organic backdrop with earth textures",
      surfaceType: "Natural materials like wood, stone, or organic surfaces",
      accentProp: "Botanical elements, natural fibers, or organic materials",
      lighting: "Soft natural light mimicking outdoor illumination",
      cameraAngle: "Organic composition that flows with natural forms",
      colorPalette: "Earth tones, botanical greens, natural color palette",
      mood: "Organic, peaceful, and naturally harmonious",
      additionalElements: "Natural textures, organic forms, sustainable aesthetic"
    }
  };

  return fallbacks[scene] || fallbacks.studio;
}
