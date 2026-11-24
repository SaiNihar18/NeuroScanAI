import { motion } from 'framer-motion';
import { ArrowRight, Layers, ShieldCheck, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProbabilityBars } from './ProbabilityBars';

// Illustrative values for the preview card only. Not a real prediction.
const EXAMPLE = { meningioma: 0.94, glioma: 0.03, pituitary: 0.02, notumor: 0.01 };

const FACTS = [
  { icon: Layers, label: '4 classes', detail: 'Glioma, meningioma, pituitary, no tumor' },
  { icon: Gauge, label: 'Per-class confidence', detail: 'See the full probability breakdown' },
  { icon: ShieldCheck, label: 'Research use only', detail: 'Not a medical device' },
];

export const Hero = () => (
  <section className="relative overflow-hidden border-b border-border">
    <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />

    <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          Xception transfer-learning model
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.1] md:text-5xl lg:text-6xl">
          Brain MRI classification,
          <span className="text-primary"> explained with confidence.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Upload a brain MRI slice and get an AI-assisted classification with a full probability breakdown across four
          categories, in seconds.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link to="/#analyze">
              Analyze a scan <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/about">About the model</Link>
          </Button>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-3">
          {FACTS.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative mx-auto w-full max-w-md"
        aria-hidden
      >
        <div className="surface p-6 shadow-elevated">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Example output</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Illustrative</span>
          </div>
          <p className="mt-3 text-2xl font-semibold">Meningioma</p>
          <p className="num text-sm text-muted-foreground">94.0% confidence</p>
          <div className="mt-6">
            <ProbabilityBars probabilities={EXAMPLE} highlight="meningioma" decorative />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
