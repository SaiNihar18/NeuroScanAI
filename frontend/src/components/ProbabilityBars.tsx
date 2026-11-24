import { motion } from 'framer-motion';
import { getClassInfo } from '@/lib/classes';
import { formatPercent } from '@/utils/format';

interface ProbabilityBarsProps {
  probabilities: Record<string, number>;
  /** class key to emphasise */
  highlight?: string;
  /** render as a decorative example (hidden from assistive tech) */
  decorative?: boolean;
}

export const ProbabilityBars = ({ probabilities, highlight, decorative }: ProbabilityBarsProps) => {
  const rows = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <ul className="space-y-3.5" aria-hidden={decorative || undefined} aria-label={decorative ? undefined : 'Probability per class'}>
      {rows.map(([key, value], i) => {
        const info = getClassInfo(key);
        const isTop = key === highlight;
        return (
          <li key={key}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className={isTop ? 'font-semibold' : 'text-muted-foreground'}>{info.label}</span>
              <span className={`num ${isTop ? 'font-semibold' : 'text-muted-foreground'}`}>{formatPercent(value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: `hsl(var(${info.colorVar}))`, opacity: isTop ? 1 : 0.55 }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(value * 100, value > 0 ? 1 : 0)}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
