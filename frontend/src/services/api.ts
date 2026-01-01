import axios from 'axios';
import { PredictionResult } from '@/types/prediction';

const API_BASE = import.meta.env.VITE_API_BASE;

// Backend response type
interface PredictApiResponse {
  predicted_class: string;
  confidence: number;
  probabilities: number[];
}

export const predictTumor = async (imageFile: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const startTime = performance.now();

  try {
    console.log('API_BASE:', API_BASE);
    console.log('Making request to:', `${API_BASE}/predict`);
    
    const response = await axios.post<PredictApiResponse>(
      `${API_BASE}/predict`,
      formData
    );

    const endTime = performance.now();
    const inferenceTime = (endTime - startTime) / 1000;

    console.log('API Response:', response.data);

    return {
      class: response.data.predicted_class,
      confidence: response.data.confidence,
      inferenceTimeSec: inferenceTime,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('API Error:', error);

    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      throw new Error(
        error.response?.data?.detail ||
        error.message ||
        'Failed to analyze image. Please try again.'
      );
    }

    throw new Error('An unexpected error occurred. Please try again.');
  }
};
