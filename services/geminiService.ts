
import { GoogleGenAI, Type } from "@google/genai";
import { Option, DecisionMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIWeightedOptions = async (
  options: Option[],
  context: { time: string; weather: string; location?: string }
): Promise<Option[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these choices based on context: Time=${context.time}, Weather=${context.weather}. 
    Options: ${options.map(o => o.label).join(', ')}.
    Rules: 
    - If late night (>22:00), decrease caffeine/outdoor weights.
    - If rainy, decrease outdoor weights.
    - Output ONLY JSON array of weights matching the option order.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.NUMBER,
          description: "Weight from 0.1 to 2.0"
        }
      }
    }
  });

  try {
    const weights: number[] = JSON.parse(response.text.trim());
    return options.map((opt, idx) => ({
      ...opt,
      weight: weights[idx] || 1.0
    }));
  } catch (e) {
    console.error("Failed to parse AI weights", e);
    return options;
  }
};

export const getSubconsciousAnalysis = async (expressionData: string): Promise<string> => {
  // Mock analysis - in a real app, we'd send the frame to Gemini
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user is looking at a decision result. Based on this visual data (simulated: ${expressionData}), 
    are they showing signs of 'Ouch' (regret) or 'Yay' (satisfaction)? Answer briefly in Chinese.`,
  });
  return response.text;
};
