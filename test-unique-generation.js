// Test script to verify unique generation logic
const { generateSceneDetails } = require('./utils/scenePrompts.ts');

async function testUniqueGeneration() {
  console.log("Testing unique scene generation...");
  
  const testParams = {
    userPrompt: "A sleek water bottle in a modern setting",
    scene: "studio",
    aspectRatio: "1024x1024"
  };

  // Generate multiple scene details to verify uniqueness
  const results = [];
  
  for (let i = 0; i < 3; i++) {
    try {
      const sceneDetails = await generateSceneDetails(testParams);
      results.push(sceneDetails);
      console.log(`\nGeneration ${i + 1}:`, JSON.stringify(sceneDetails, null, 2));
    } catch (error) {
      console.error(`Error in generation ${i + 1}:`, error);
    }
  }

  // Check for uniqueness
  const uniqueBackgrounds = new Set(results.map(r => r.backgroundTone));
  const uniqueSurfaces = new Set(results.map(r => r.surfaceType));
  
  console.log(`\nUnique backgrounds: ${uniqueBackgrounds.size}/${results.length}`);
  console.log(`Unique surfaces: ${uniqueSurfaces.size}/${results.length}`);
  
  if (uniqueBackgrounds.size > 1 || uniqueSurfaces.size > 1) {
    console.log("✅ Unique generation is working!");
  } else {
    console.log("⚠️ All generations are identical - may need more variation");
  }
}

testUniqueGeneration();
