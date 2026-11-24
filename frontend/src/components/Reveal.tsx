import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/** Subtle fade + rise on scroll. Respects reduced-motion via the app-level MotionConfig. */
export const Reveal = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.45, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) => (
  <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
  </Reveal>
);
