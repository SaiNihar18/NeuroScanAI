import axios from 'axios';
import { PredictionResult } from '@/types/prediction';

// Empty string = same origin (FastAPI serving the built frontend).
// VITE_API_BASE_URL is accepted as a legacy alias.
const API_BASE = ((import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL ?? '') as string).replace(
  /\/+$/,
  '',
);

interface PredictApiResponse {
  predicted_class: string;
  confidence: number;
  probabilities?: Record<string, number>;
  /** Older backend versions */
  all_probs?: number[];
  classes?: string[];
  predict_time_ms?: number;
}

export interface PredictOptions {
  signal?: AbortSignal;
  /** Called with 0..1 while the file is uploading */
  onUploadProgress?: (fraction: number) => void;
}

export class AnalysisCancelled extends Error {
  constructor() {
    super('Analysis cancelled');
    this.name = 'AnalysisCancelled';
  }
}

const toProbabilities = (data: PredictApiResponse): Record<string, number> => {
  if (data.probabilities) return data.probabilities;
  const { all_probs, classes } = data;
  if (all_probs && classes) {
    return Object.fromEntries(classes.map((c, i) => [c, all_probs[i]]));
  }
  return { [data.predicted_class]: data.confidence };
};

export const predictTumor = async (
  imageFile: File,
  { signal, onUploadProgress }: PredictOptions = {},
): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', imageFile);
  const start = performance.now();

  try {
    const { data } = await axios.post<PredictApiResponse>(`${API_BASE}/predict`, formData, {
      signal,
      timeout: 120_000,
      onUploadProgress: (e) => {
        if (e.total) onUploadProgress?.(e.loaded / e.total);
      },
    });

    return {
      predictedClass: data.predicted_class,
      confidence: data.confidence,
      probabilities: toProbabilities(data),
      inferenceMs: data.predict_time_ms,
      roundTripSec: (performance.now() - start) / 1000,
      timestamp: Date.now(),
    };
  } catch (error) {
    if (axios.isCancel(error)) throw new AnalysisCancelled();

    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') throw new Error(detail);
      if (error.code === 'ECONNABORTED') throw new Error('The analysis timed out. Please try again.');
      if (!error.response) {
        throw new Error('Cannot reach the analysis server. Check your connection and try again.');
      }
      throw new Error(`The server returned an error (${error.response.status}). Please try again.`);
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
