export interface PredictionResult {
  /** Class key returned by the model, e.g. "glioma" or "notumor" */
  predictedClass: string;
  /** 0..1 */
  confidence: number;
  /** Probability per class key, 0..1 */
  probabilities: Record<string, number>;
  /** Model inference time reported by the server, in ms (if available) */
  inferenceMs?: number;
  /** Full request round-trip, in seconds */
  roundTripSec: number;
  timestamp: number;
}

export interface HistoryItem extends PredictionResult {
  id: string;
  /** Small JPEG data URL of the scan */
  thumbnail: string;
  fileName?: string;
}
