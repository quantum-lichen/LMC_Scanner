export interface SentenceAnalysis {
  id: string;
  text: string;
  entropy: number; // H
  coherence: number; // C
  lmcScore: number; // Score
  diagnostic: DiagnosticType;
}

export enum DiagnosticType {
  OPTIMAL = 'OPTIMAL',
  DECROCHAGE = 'DÉCROCHAGE', // Drop-out
  STEREOTYPE = 'STÉRÉOTYPE',
  BRUIT = 'BRUIT', // Noise
  NEUTRE = 'NEUTRE',
}

export interface ScanResult {
  sentences: SentenceAnalysis[];
  averageLmc: number;
  averageEntropy: number;
  averageCoherence: number;
}

export interface ScannerState {
  contextTopic: string;
  textBlock: string;
  isScanning: boolean;
  result: ScanResult | null;
  error: string | null;
}