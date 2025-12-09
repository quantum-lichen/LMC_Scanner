import { DiagnosticType } from '../types';

/**
 * Calculates the entropy of a text string using the CompressionStream API (GZIP).
 * This approximates the Python zlib behavior: len(compressed) / len(raw).
 */
export const calculateEntropy = async (text: string): Promise<number> => {
  if (!text || text.length === 0) return 0.0;

  try {
    const encoder = new TextEncoder();
    const rawBytes = encoder.encode(text);
    
    // Create a stream to compress the data
    const stream = new Blob([rawBytes]).stream().pipeThrough(new CompressionStream('gzip'));
    const response = new Response(stream);
    const blob = await response.blob();
    const compressedSize = blob.size;

    // Calculate ratio. Note: JS Gzip headers might differ slightly from Python zlib,
    // but the relative complexity measurement holds true.
    return compressedSize / rawBytes.length;
  } catch (e) {
    console.error("Entropy calculation failed", e);
    // Fallback approximation if CompressionStream fails (rare in modern browsers)
    const uniqueChars = new Set(text).size;
    return uniqueChars / text.length;
  }
};

/**
 * Determines the diagnostic category based on the LMC metrics.
 * Thresholds mirror the Python script.
 */
export const getDiagnostic = (coherence: number, entropy: number, lmcScore: number): DiagnosticType => {
  if (coherence < 0.25) {
    return DiagnosticType.DECROCHAGE;
  } else if (lmcScore > 1.8) {
    return DiagnosticType.OPTIMAL;
  } else if (entropy < 0.3) {
    return DiagnosticType.STEREOTYPE;
  } else if (entropy > 0.85) {
    return DiagnosticType.BRUIT;
  } else {
    return DiagnosticType.NEUTRE;
  }
};

/**
 * Calculates the LMC Law score.
 * Score = Coherence / (Entropy + epsilon)
 */
export const calculateLmcScore = (coherence: number, entropy: number): number => {
  return coherence / (entropy + 0.0001);
};