import { GoogleGenAI, Type } from "@google/genai";
import { MacroData } from '../types';

export async function analyzeFoodImage(base64Image: string): Promise<{ name: string; macros: MacroData }> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prompt engineering for nutrition analysis
  const prompt = `
    Analise esta imagem de comida. Identifique o prato principal ou ingredientes.
    Estime o conteúdo nutricional para a porção mostrada na imagem.
    Retorne o nome do prato EM PORTUGUÊS e as estimativas de calorias, proteína (g), carboidratos (g), gorduras (g) e fibras (g).
    Seja realista com a porção.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image
                }
            },
            {
                text: prompt
            }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nome do alimento em Português" },
            calories: { type: Type.NUMBER, description: "Total de Calorias" },
            protein: { type: Type.NUMBER, description: "Proteínas em gramas" },
            carbs: { type: Type.NUMBER, description: "Carboidratos em gramas" },
            fats: { type: Type.NUMBER, description: "Gorduras em gramas" },
            fiber: { type: Type.NUMBER, description: "Fibras em gramas" },
          },
          required: ["name", "calories", "protein", "carbs", "fats", "fiber"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    const result = JSON.parse(text);

    return {
      name: result.name,
      macros: {
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
        fiber: result.fiber,
      },
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo purposes if AI fails or key is invalid
    throw error;
  }
}