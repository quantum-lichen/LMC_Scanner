import { GoogleGenAI, Type } from "@google/genai";
import { calculateEntropy, calculateLmcScore, getDiagnostic } from "./mathUtils";
import { SentenceAnalysis, ScanResult } from "../types";

const processEnvApiKey = process.env.API_KEY;

if (!processEnvApiKey) {
    console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

/**
 * Analyzes the text block against the context topic.
 * 
 * Strategy:
 * 1. We use Gemini to parse the text into sentences and rate the "Coherence" (Semantic Similarity)
 *    of each sentence against the topic. This replaces the local `sentence-transformers` model.
 * 2. We calculate Entropy locally using browser compression APIs.
 * 3. We combine these to generate the LMC Score.
 */
export const performCognitiveScan = async (
  contextTopic: string,
  textBlock: string
): Promise<ScanResult> => {
  
  // prompt construction
  const prompt = `
    You are a semantic analysis engine. 
    Context Topic: "${contextTopic}"
    
    Analyze the following text block. Split it into individual sentences (ignore very short segments < 10 chars).
    For each sentence, calculate a "coherence" score between 0.0 and 1.0, representing how semantically relevant 
    and consistent the sentence is regarding the Context Topic.
    
    1.0 = Perfectly on topic.
    0.0 = Completely off topic or nonsense.
    
    Text Block:
    "${textBlock}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  coherence: { type: Type.NUMBER, description: "Score between 0.0 and 1.0" }
                },
                required: ["text", "coherence"]
              }
            }
          }
        }
      }
    });

    const jsonResponse = JSON.parse(response.text);
    const segments = jsonResponse.segments || [];

    const analyzedSentences: SentenceAnalysis[] = [];
    let totalLmc = 0;
    let totalEntropy = 0;
    let totalCoherence = 0;

    for (const segment of segments) {
      const text = segment.text;
      const coherence = Math.max(0, Math.min(1, segment.coherence)); // Clamp 0-1
      
      // Calculate Entropy Client-Side
      const entropy = await calculateEntropy(text);
      
      // Calculate LMC
      const lmcScore = calculateLmcScore(coherence, entropy);
      
      // Diagnose
      const diagnostic = getDiagnostic(coherence, entropy, lmcScore);

      analyzedSentences.push({
        id: crypto.randomUUID(),
        text,
        entropy,
        coherence,
        lmcScore,
        diagnostic
      });

      totalLmc += lmcScore;
      totalEntropy += entropy;
      totalCoherence += coherence;
    }

    const count = analyzedSentences.length;

    return {
      sentences: analyzedSentences,
      averageLmc: count > 0 ? totalLmc / count : 0,
      averageEntropy: count > 0 ? totalEntropy / count : 0,
      averageCoherence: count > 0 ? totalCoherence / count : 0,
    };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze text via Cognitive Cortex.");
  }
};