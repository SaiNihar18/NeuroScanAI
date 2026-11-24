import { FileUp, ScanSearch, Stethoscope } from 'lucide-react';
import { Reveal, SectionHeading } from './Reveal';

const STEPS = [
  {
    icon: FileUp,
    title: 'Upload an MRI slice',
    description: 'Drop a PNG, JPG, BMP or WebP image (up to 10 MB). It is sent to the analysis server and not kept there.',
  },
  {
    icon: ScanSearch,
    title: 'The model analyses it',
    description: 'The image is resized to 299 × 299 and passed through an Xception-based classifier trained on brain MRI scans.',
  },
  {
    icon: Stethoscope,
    title: 'Review the result',
    description: 'See the predicted class and the probability for each category, then discuss any concern with a professional.',
  },
];

export const HowItWorks = () => (
  <section id="how-it-works" className="section border-t border-border bg-muted/30">
    <div className="container">
      <SectionHeading eyebrow="How it works" title="From scan to result in three steps" />
      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, description }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.08} className="surface h-full p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="num text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
