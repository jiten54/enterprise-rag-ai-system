import { GoogleGenAI, Type } from "@google/genai";
import { Document, RagResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an Enterprise AI Knowledge Assistant powered by Retrieval-Augmented Generation (RAG).

Your role is to provide accurate, context-aware answers strictly based on retrieved data.

CORE BEHAVIOR:
* You MUST answer only using the provided context.
* Do NOT rely on general knowledge if context is available.
* If the answer is not found in the context, clearly say: "The answer is not available in the provided data."

RESPONSE STRUCTURE:
You must return the response in JSON format matching this schema:
{
  "answer": "clear, concise answer",
  "keyPoints": ["Bullet 1", "Bullet 2", "..."],
  "sourceSummary": "brief summary of retrieved content used",
  "confidence": "High" | "Medium" | "Low"
}

RULES:
* No hallucination.
* No guessing.
* Prefer exact information from context.
* If partial data -> mention limitation.`;

export async function queryRag(query: string, documents: Document[]): Promise<RagResponse> {
  const context = documents.length > 0 
    ? documents.map(d => `Title: ${d.title}\nContent: ${d.content}`).join("\n\n---\n\n")
    : "No context provided.";

  const prompt = `Context:
${context}

User Query: ${query}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            keyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            sourceSummary: { type: Type.STRING },
            confidence: { 
              type: Type.STRING,
              enum: ["High", "Medium", "Low"]
            }
          },
          required: ["answer", "keyPoints", "sourceSummary", "confidence"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText) as RagResponse;
  } catch (error) {
    console.error("RAG Query Error:", error);
    return {
      answer: "An error occurred while processing your request.",
      keyPoints: ["Check your API configuration", "Ensure documents are provided"],
      sourceSummary: "System Error",
      confidence: "Low"
    };
  }
}
