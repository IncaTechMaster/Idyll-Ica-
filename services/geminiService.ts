
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice, ChordType, NoteName } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getMusicalAdvice = async (root: NoteName, type: ChordType): Promise<AIAdvice> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explica brevemente por qué el acorde ${root} ${type} es importante o cómo se usa comúnmente en la música. Propón un "tema musical" o estado de ánimo que este acorde evoca y una progresión de 4 acordes que empiece con él. Responde en JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, description: "Un nombre creativo para el tema musical" },
            progression: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de 4 acordes"
            },
            description: { type: Type.STRING, description: "Breve explicación teórica" }
          },
          required: ["theme", "progression", "description"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data as AIAdvice;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      theme: "Error de conexión",
      progression: [root, "?", "?", "?"],
      description: "No se pudo conectar con el maestro AI para obtener consejos detallados."
    };
  }
};
