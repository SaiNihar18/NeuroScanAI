import { useCallback, useEffect, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ImagePlus, Loader2, RefreshCw, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnalysisCancelled, predictTumor } from '@/services/api';
import { HistoryItem, PredictionResult } from '@/types/prediction';
import { addToHistory, createThumbnail } from '@/utils/history';
import { formatBytes } from '@/utils/format';
import { ResultCard } from './ResultCard';
import { SectionHeading } from './Reveal';

const MAX_BYTES = 10 * 1024 * 1024;
const SLOW_AFTER_MS = 10_000;

type Status = 'idle' | 'analyzing' | 'done';

const STEPS = ['Uploading scan', 'Running model', 'Preparing result'];

interface Props {
  /** A saved result chosen from the history list */
  viewing: HistoryItem | null;
  onViewingConsumed: () => void;
}

const rejectionMessage = (rejections: FileRejection[]): string => {
  const code = rejections[0]?.errors[0]?.code;
  if (code === 'file-too-large') return `That file is too large. The maximum size is ${formatBytes(MAX_BYTES)}.`;
  if (code === 'file-invalid-type') return 'Unsupported file type. Please upload a PNG, JPG, BMP or WebP image.';
  if (code === 'too-many-files') return 'Please upload one image at a time.';
  return 'That file could not be used.';
};

export const AnalysisWorkspace = ({ viewing, onViewingConsumed }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [uploadFraction, setUploadFraction] = useState(0);
  const [slow, setSlow] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const slowTimerRef = useRef<number>();
  const urlRef = useRef<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const cancelWork = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    window.clearTimeout(slowTimerRef.current);
    setSlow(false);
  }, []);

  const releaseUrl = useCallback(() => {
    if (urlRef.current?.startsWith('blob:')) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
  }, []);

  const clearAll = useCallback(() => {
    cancelWork();
    releaseUrl();
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setResult(null);
    setStatus('idle');
    setUploadFraction(0);
  }, [cancelWork, releaseUrl]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      abortRef.current?.abort();
      window.clearTimeout(slowTimerRef.current);
      if (urlRef.current?.startsWith('blob:')) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  // Show a saved result picked from history
  useEffect(() => {
    if (!viewing) return;
    cancelWork();
    releaseUrl();
    setFile(null);
    setDimensions(null);
    setPreviewUrl(viewing.thumbnail);
    urlRef.current = viewing.thumbnail;
    setResult(viewing);
    setStatus('done');
  }, [viewing, cancelWork, releaseUrl]);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        toast.error(rejectionMessage(rejections));
        return;
      }
      const picked = accepted[0];
      if (!picked) return;
      clearAll();
      onViewingConsumed();
      const url = URL.createObjectURL(picked);
      urlRef.current = url;
      setFile(picked);
      setPreviewUrl(url);
    },
    [clearAll, onViewingConsumed],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/bmp': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: MAX_BYTES,
    multiple: false,
    noClick: !!previewUrl,
    noKeyboard: !!previewUrl,
    disabled: status === 'analyzing',
  });

  const handleAnalyze = async () => {
    if (!file || !previewUrl) return;
    cancelWork();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('analyzing');
    setResult(null);
    setUploadFraction(0);
    slowTimerRef.current = window.setTimeout(() => setSlow(true), SLOW_AFTER_MS);

    try {
      const prediction = await predictTumor(file, {
        signal: controller.signal,
        onUploadProgress: setUploadFraction,
      });
      window.clearTimeout(slowTimerRef.current);
      setSlow(false);
      setResult(prediction);
      setStatus('done');

      createThumbnail(previewUrl)
        .then((thumbnail) => addToHistory({ ...prediction, thumbnail, fileName: file.name }))
        .catch(() => undefined);

      // On small screens the result sits below the scan: bring it into view.
      if (window.matchMedia('(max-width: 1023px)').matches) {
        window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch (error) {
      if (error instanceof AnalysisCancelled) return;
      window.clearTimeout(slowTimerRef.current);
      setSlow(false);
      setStatus('idle');
      toast.error(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  const handleAnalyzeAnother = () => {
    clearAll();
    onViewingConsumed();
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzing = status === 'analyzing';
  const activeStep = analyzing ? (uploadFraction < 1 ? 0 : 1) : status === 'done' ? 3 : -1;

  return (
    <section id="analyze" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Analyze"
          title="Upload a brain MRI scan"
          description="Use a single axial, coronal or sagittal MRI slice as a PNG, JPG, BMP or WebP image."
        />

        <p className="sr-only" role="status" aria-live="polite">
          {analyzing ? 'Analyzing scan' : status === 'done' && result ? 'Analysis complete. Results are shown.' : ''}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* ---------- Scan panel ---------- */}
          <div className="surface p-6 md:p-8">
            {!previewUrl ? (
              <div
                {...getRootProps({
                  className: cn(
                    'flex min-h-[22rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/40',
                  ),
                  'aria-label': 'Upload an MRI image. Press Enter to browse files.',
                })}
              >
                <input {...getInputProps()} />
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <UploadCloud className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-5 text-base font-semibold">
                  {isDragActive ? 'Drop the image to upload' : 'Drag and drop an MRI image'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">or click to browse your files</p>
                <Button type="button" variant="outline" className="mt-6" tabIndex={-1}>
                  <ImagePlus /> Choose image
                </Button>
                <p className="mt-6 text-xs text-muted-foreground">PNG, JPG, BMP or WebP · up to {formatBytes(MAX_BYTES)}</p>
              </div>
            ) : (
              <div {...getRootProps()} className="space-y-4 outline-none">
                <input {...getInputProps()} />
                <div className="relative aspect-square overflow-hidden rounded-lg bg-black">
                  <img
                    src={previewUrl}
                    alt={
                      result
                        ? `Uploaded MRI scan, classified as ${result.predictedClass}`
                        : 'Uploaded MRI scan preview'
                    }
                    onLoad={(e) => {
                      const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                      if (file) setDimensions(`${w} × ${h}`);
                    }}
                    className={cn('h-full w-full object-contain transition-opacity', analyzing && 'opacity-70')}
                  />
                  {analyzing && <div className="scan-line" aria-hidden />}
                </div>

                {file ? (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="num text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                        {dimensions && ` · ${dimensions}px`}
                      </p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={open} disabled={analyzing}>
                      <RefreshCw /> Replace
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Saved result from your history (thumbnail preview).</p>
                )}

                {/* Progress steps driven by real request events */}
                <AnimatePresence initial={false}>
                  {analyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ol className="space-y-2.5 rounded-lg border border-border bg-muted/40 p-4">
                        {STEPS.map((label, i) => {
                          const done = i < activeStep;
                          const active = i === activeStep;
                          return (
                            <li key={label} className="flex items-center gap-3 text-sm">
                              <span
                                className={cn(
                                  'flex h-5 w-5 items-center justify-center rounded-full border text-primary',
                                  done ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                                )}
                              >
                                {done ? (
                                  <Check className="h-3 w-3" aria-hidden />
                                ) : active ? (
                                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                                ) : null}
                              </span>
                              <span className={cn(!done && !active && 'text-muted-foreground', active && 'font-medium')}>
                                {label}
                                {active && i === 0 && <span className="num ml-2 text-xs text-muted-foreground">{Math.round(uploadFraction * 100)}%</span>}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                      {slow && (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          Still working. If the server was idle it may be starting up the model, which can take up to a minute
                          the first time.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  {file && status !== 'done' && (
                    <Button type="button" onClick={handleAnalyze} disabled={analyzing} className="flex-1" size="lg">
                      {analyzing ? (
                        <>
                          <Loader2 className="animate-spin" /> Analyzing…
                        </>
                      ) : (
                        'Analyze scan'
                      )}
                    </Button>
                  )}
                  {analyzing ? (
                    <Button type="button" variant="outline" size="lg" onClick={clearAll}>
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className={cn(!(file && status !== 'done') && 'flex-1')}
                      onClick={handleAnalyzeAnother}
                    >
                      <X /> {status === 'done' ? 'Clear' : 'Remove'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ---------- Result panel ---------- */}
          <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
            {result ? (
              <ResultCard result={result} onAnalyzeAnother={handleAnalyzeAnother} />
            ) : (
              <div className="surface flex h-full min-h-[22rem] flex-col p-6 md:p-8">
                <p className="eyebrow">Analysis result</p>
                {analyzing ? (
                  <div className="mt-6 space-y-6" aria-hidden>
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-16 w-full" />
                    <div className="space-y-4">
                      {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                    <div className="w-full max-w-xs space-y-4 opacity-60" aria-hidden>
                      {[78, 46, 30, 14].map((w) => (
                        <div key={w} className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-border" style={{ width: `${w}%` }} />
                        </div>
                      ))}
                    </div>
                    <p className="mt-8 text-base font-medium">No result yet</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Upload a scan and press Analyze to see the predicted class and probability for each category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
