import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { PredictionResult } from '@/types/prediction';
import { Progress } from '@/components/ui/progress';

interface ResultCardProps {
  result: PredictionResult;
}

export const ResultCard = ({ result }: ResultCardProps) => {
  console.log('ResultCard received result:', result);
  
  // Check if result has the required properties
  if (!result || !result.class || result.confidence === undefined) {
    console.error('Invalid result data:', result);
    return (
      <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
        <p className="text-red-500">Error: Invalid result data received</p>
      </div>
    );
  }

  const confidencePercentage = Math.round(result.confidence * 100);
  const isHighConfidence = result.confidence >= 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl p-8 shadow-lg border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        {isHighConfidence ? (
          <CheckCircle className="h-8 w-8 text-green-500" />
        ) : (
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        )}
        <h3 className="text-2xl font-bold">Analysis Results</h3>
      </div>

      <div className="space-y-6">
        {/* Tumor Type */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Detected Tumor Type
          </label>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-2xl font-bold text-primary">{result.class}</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-muted-foreground">
              Confidence Score
            </label>
            <span className="text-2xl font-bold">{confidencePercentage}%</span>
          </div>
          <Progress value={confidencePercentage} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {isHighConfidence
              ? 'High confidence prediction'
              : 'Consider additional medical consultation'}
          </p>
        </div>

        {/* Inference Time */}
        {result.inferenceTimeSec && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Analysis completed in {result.inferenceTimeSec.toFixed(2)} seconds
            </span>
          </div>
        )}

        {/* Important Notice */}
        <div className="p-4 rounded-xl bg-muted border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> This is an AI-assisted preliminary analysis. 
            Always consult with qualified healthcare professionals for accurate diagnosis 
            and treatment decisions.
          </p>
        </div>
      </div>
    </motion.div>
  );
};