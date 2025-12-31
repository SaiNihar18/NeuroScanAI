import axios from 'axios';
import { PredictionResult } from '@/types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const predictTumor = async (imageFile: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    console.log('Sending request to:', `${API_BASE_URL}/predict`);
    const response = await axios.post(
      `${API_BASE_URL}/predict`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Log the response for debugging
    console.log('API Response:', response.data);

    return {
      class: response.data.predicted_class,
      confidence: response.data.confidence,
      inferenceTimeSec: response.data.inference_time_sec,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Response:', error.response);
      throw new Error(error.response?.data?.message || 'Failed to analyze image. Please try again.');
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};