import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyDietPlan } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure this is handled securely.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateDailyDietPlan = async (
  profile: UserProfile,
  goal: 'Muscle Gain' | 'Fat Loss' | 'Maintenance' = 'Muscle Gain'
): Promise<DailyDietPlan> => {
  
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes
    return {
      summary: "Offline mode: Showing sample vegetarian plan.",
      meals: [
        {
          type: "Breakfast",
          mealName: "Oatmeal & Whey",
          description: "High fiber oats mixed with protein powder.",
          calories: 450,
          protein: 30,
          ingredients: ["1 cup Oats", "1 scoop Whey Protein", "1 tbsp Peanut Butter"],
          instructions: ["Boil oats", "Mix in protein", "Top with PB"]
        },
        {
          type: "Lunch",
          mealName: "Tofu Stir-fry",
          description: "Simple tofu and veggie mix.",
          calories: 500,
          protein: 25,
          ingredients: ["200g Tofu", "Broccoli", "Soy Sauce", "Rice"],
          instructions: ["Cube tofu", "Stir fry with veggies", "Serve over rice"]
        },
        {
          type: "Dinner",
          mealName: "Lentil Soup",
          description: "Warm and filling lentil soup.",
          calories: 400,
          protein: 20,
          ingredients: ["1 cup Lentils", "Carrots", "Onion", "Spices"],
          instructions: ["Boil lentils", "Sauté veggies", "Simmer together"]
        },
        {
          type: "Snack",
          mealName: "Greek Yogurt Bowl",
          description: "Quick protein fix.",
          calories: 200,
          protein: 15,
          ingredients: ["1 cup Greek Yogurt", "Berries"],
          instructions: ["Mix and eat"]
        }
      ]
    };
  }

  try {
    const prompt = `
      Create a full day diet plan (Breakfast, Lunch, Dinner, Snack) for a user with these stats:
      - Weight: ${profile.weightKg}kg
      - Diet: ${profile.diet}
      - Allergy: ${profile.allergy}
      - Goal: ${goal}
      
      For each meal, provide:
      1. Meal Name
      2. Brief Description
      3. Calories & Protein (approx)
      4. List of Ingredients (quantities)
      5. Step-by-step cooking instructions (concise)
      
      Also provide a 1-sentence summary of why this plan fits their goal.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
                  mealName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  ingredients: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["type", "mealName", "description", "calories", "protein", "ingredients", "instructions"]
              }
            }
          },
          required: ["summary", "meals"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as DailyDietPlan;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return safe fallback
    return {
      summary: "Error connecting to AI. Using safe fallback plan.",
      meals: [
         {
          type: "Breakfast",
          mealName: "Toast & Eggs (Fallback)",
          description: "Classic breakfast.",
          calories: 400,
          protein: 20,
          ingredients: ["2 slices bread", "2 eggs"],
          instructions: ["Toast bread", "Fry eggs"]
        }
      ]
    };
  }
};

export const generateFormTip = async (exerciseName: string, issue: 'Failed Reps' | 'High RPE'): Promise<string> => {
   if (!apiKey) return "Focus on your breathing and brace your core.";

   try {
     const response = await ai.models.generateContent({
       model: "gemini-3-flash-preview",
       contents: `Provide a one-sentence corrective form tip for ${exerciseName} for a user who is experiencing '${issue}'. Keep it concise and actionable.`,
     });
     return response.text || "Focus on form over weight.";
   } catch (e) {
     return "Maintain a neutral spine and control the tempo.";
   }
}

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 */
export const generateImageEdit = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    // Check for inline data (image) in response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated. The model might have returned text only.");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};