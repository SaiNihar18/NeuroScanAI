import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UploadSection } from '@/components/UploadSection';
import { HistorySection } from '@/components/HistorySection';
import { Footer } from '@/components/Footer';
import { initTheme } from '@/utils/theme';

const Index = () => {
  useEffect(() => {
    initTheme();
    
    // Test the API service
    const testApi = async () => {
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
        
        const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });
        
        // Dynamically import the API service
        const { predictTumor } = await import('@/services/api');
        console.log('Calling predictTumor...');
        const result = await predictTumor(file);
        console.log('Success! Result:', result);
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };
    
    // Only run the test if we're in development mode
    if (import.meta.env.DEV) {
      testApi();
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <UploadSection />
      <HistorySection />
      <Footer />
    </div>
  );
};

export default Index;