import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { predictTumor } from '@/services/api';
import { PredictionResult } from '@/types/prediction';
import { addToHistory } from '@/utils/history';
import { toast } from 'sonner';
import { ResultCard } from './ResultCard';

export const UploadSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate progress more realistically
    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += 5;
      if (progressValue >= 95) {
        clearInterval(progressInterval);
        setProgress(95);
      } else {
        setProgress(progressValue);
      }
    }, 100);

    try {
      console.log('Analyzing image...', selectedFile);
      const predictionResult = await predictTumor(selectedFile);
      console.log('Prediction result received:', predictionResult);
      
      // Ensure progress reaches 100% before showing results
      clearInterval(progressInterval);
      setProgress(100);
      
      // Wait a moment to show 100% progress before displaying results
      setTimeout(() => {
        setResult(predictionResult);
        addToHistory({
          ...predictionResult,
          imageUrl: preview,
          timestamp: Date.now(),
        });
        toast.success('Analysis complete!');
        // Reset analyzing state after a short delay to ensure smooth transition
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 500);
      }, 500);
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setProgress(0);
      setIsAnalyzing(false);
      toast.error(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
  };

  const handleAnalyzeAnother = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setProgress(0);
    setIsAnalyzing(false);
  };

  return (
    <section id="upload-section" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Upload MRI Scan
          </h2>
          <p className="text-xl text-muted-foreground">
            Upload a brain MRI image for instant AI-powered analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              {!preview ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an MRI image'}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to select a file
                  </p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-muted">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span>Processing...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* After analysis is complete, show Analyze Another button */}
                  {result && (
                    <Button 
                      onClick={handleAnalyzeAnother} 
                      variant="outline" 
                      className="w-full"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Analyze Another Image
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Results will appear here</p>
                  <p className="text-sm mt-2">Upload an image to get started</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};