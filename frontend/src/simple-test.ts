// Simple test to verify API service
console.log('Testing API service...');

// Create a simple test image
const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 300, 300);

// Convert to blob
canvas.toBlob(async (blob) => {
  const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
  
  try {
    // Dynamically import the API service
    const { predictTumor } = await import('./services/api');
    console.log('Calling predictTumor...');
    const result = await predictTumor(file);
    console.log('Success! Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
});