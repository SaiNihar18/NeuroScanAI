// Simple test to check API service
const testApiService = async () => {
  try {
    // Create a simple test image
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 300, 300);
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    });
    
    // Create file
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
    
    // Import and test the API service
    const { predictTumor } = await import('./services/api');
    console.log('Calling predictTumor...');
    const result = await predictTumor(file);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the test
testApiService();