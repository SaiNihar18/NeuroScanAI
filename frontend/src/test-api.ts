// Simple test to check API service
import { predictTumor } from './services/api';

// Create a mock file
const createMockFile = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 300, 300);
  
  return new Promise<File>((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
      resolve(file);
    });
  });
};

// Test the API
const testApi = async () => {
  try {
    console.log('Creating mock file...');
    const file = await createMockFile();
    console.log('File created:', file);
    
    console.log('Calling predictTumor...');
    const result = await predictTumor(file);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the test
testApi();