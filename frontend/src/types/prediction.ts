export interface PredictionResult {
  class: string;
  confidence: number;
  timestamp?: number;
  imageUrl?: string;
  inferenceTimeSec?: number;
}

export interface HistoryItem extends PredictionResult {
  id: string;
  timestamp: number;
  imageUrl: string;
}