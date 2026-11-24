import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clipboard, Download, Info, RotateCcw, ScanSearch } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getClassInfo, LOW_CONFIDENCE } from '@/lib/classes';
import { cn } from '@/lib/utils';
import { PredictionResult } from '@/types/prediction';
import { formatPercent } from '@/utils/format';
import { ProbabilityBars } from './ProbabilityBars';

interface ResultCardProps {
  result: PredictionResult;
  onAnalyzeAnother: () => void;
}

type Tone = 'success' | 'info' | 'warning';

const TONES: Record<Tone, { badge: string; icon: string }> = {
  success: { badge: 'bg-success/10 text-success border-success/25', icon: 'text-success' },
  info: { badge: 'bg-primary/10 text-primary border-primary/25', icon: 'text-primary' },
  warning: { badge: 'bg-warning/10 text-warning border-warning/30', icon: 'text-warning' },
};

const buildSummary = (result: PredictionResult) => {
  const info = getClassInfo(result.predictedClass);
  const lines = [
    'NeuroScan AI - analysis summary',
    `Date: ${new Date(result.timestamp).toLocaleString()}`,
    `Result: ${info.label}`,
    `Confidence: ${formatPercent(result.confidence)}`,
    '',
    'Probabilities:',
    ...Object.entries(result.probabilities)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `  ${getClassInfo(k).label}: ${formatPercent(v)}`),
    '',
    'AI-assisted preliminary analysis for education and research only. Not a medical diagnosis.',
  ];
  return lines.join('\n');
};

export const ResultCard = ({ result, onAnalyzeAnother }: ResultCardProps) => {
  const info = getClassInfo(result.predictedClass);
  const uncertain = result.confidence < LOW_CONFIDENCE;
  const tone: Tone = uncertain ? 'warning' : info.isTumor ? 'info' : 'success';
  const Icon = uncertain ? AlertTriangle : info.isTumor ? ScanSearch : CheckCircle2;
  const heading = uncertain ? 'Uncertain result' : info.isTumor ? 'Possible tumor pattern' : 'No tumor pattern found';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(result));
      toast.success('Summary copied to clipboard');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([buildSummary(result)], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroscan-report-${new Date(result.timestamp).toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="surface flex h-full flex-col p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Analysis result</p>
          <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{info.label}</h3>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            TONES[tone].badge,
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {heading}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between rounded-lg bg-muted/60 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="num text-3xl font-semibold leading-tight">{formatPercent(result.confidence)}</p>
        </div>
        <p className="max-w-[55%] text-right text-xs leading-snug text-muted-foreground">
          {uncertain
            ? 'The model is not very sure about this scan. Treat the result with extra caution.'
            : 'The model is confident in this classification.'}
        </p>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold">Probability by class</h4>
        <ProbabilityBars probabilities={result.probabilities} highlight={result.predictedClass} />
      </div>

      {info.description && <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{info.description}</p>}

      <dl className="num mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        {result.inferenceMs !== undefined && (
          <div className="flex gap-1.5">
            <dt>Model time</dt>
            <dd className="text-foreground">{(result.inferenceMs / 1000).toFixed(2)}s</dd>
          </div>
        )}
        <div className="flex gap-1.5">
          <dt>Total time</dt>
          <dd className="text-foreground">{result.roundTripSec.toFixed(2)}s</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p>
          This is an AI-assisted preliminary analysis for education and research. It is not a diagnosis. Please consult a
          qualified healthcare professional.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 pt-1">
        <Button onClick={onAnalyzeAnother}>
          <RotateCcw /> Analyze another
        </Button>
        <Button variant="outline" onClick={copy}>
          <Clipboard /> Copy summary
        </Button>
        <Button variant="outline" onClick={download}>
          <Download /> Download report
        </Button>
      </div>
    </motion.div>
  );
};
