import { ArrowRight, ExternalLink, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Reveal, SectionHeading } from '@/components/Reveal';
import { CLASS_INFO, CLASS_ORDER } from '@/lib/classes';
import { usePageTitle } from '@/hooks/use-page-title';

const PIPELINE = [
  { name: 'MRI image', detail: 'Resized to 299 × 299 RGB, pixels scaled to 0–1' },
  { name: 'Xception backbone', detail: 'Pre-trained on ImageNet, used as a feature extractor' },
  { name: 'Classification head', detail: 'Flatten → Dropout → Dense(128, ReLU) → Dropout' },
  { name: 'Softmax output', detail: 'Probability for each of the 4 classes' },
];

const SPECS = [
  ['Architecture', 'Xception (transfer learning)'],
  ['Input size', '299 × 299 × 3'],
  ['Output', '4 classes (softmax)'],
  ['Optimizer', 'Adamax, learning rate 0.001'],
  ['Loss', 'Categorical cross-entropy'],
  ['Tracked metrics', 'Accuracy, precision, recall'],
];

const LIMITATIONS = [
  'It only knows four categories. Any other condition, or an image that is not a brain MRI, will still be forced into one of them.',
  'It classifies a single 2D slice, not a full 3D study, and has no clinical context about the patient.',
  'Performance depends on how similar your image is to the training data: scanner, sequence, orientation and image quality all matter.',
  'The probability shown is the model’s own score, not a guarantee of correctness.',
];

const About = () => {
  usePageTitle('About the model');

  return (
    <>
      <section className="border-b border-border">
        <div className="container py-16 md:py-20">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-3">Model card</p>
            <h1 className="text-4xl font-semibold md:text-5xl">About the model</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              NeuroScan AI classifies brain MRI slices into glioma, meningioma, pituitary tumor or no tumor, using transfer
              learning on the Xception architecture. It is a learning and research project, not a clinical tool.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Architecture */}
      <section className="section">
        <div className="container">
          <SectionHeading align="left" eyebrow="Architecture" title="How a scan becomes a prediction" />
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {PIPELINE.map((step, i) => (
              <li key={step.name} className="relative">
                <Reveal delay={i * 0.07} className="surface h-full p-5">
                  <span className="num text-xs text-muted-foreground">0{i + 1}</span>
                  <h3 className="mt-2 font-semibold">{step.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </Reveal>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight
                    className="absolute -right-3.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground md:block"
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>

          <Reveal className="surface mt-8 overflow-hidden">
            <dl className="grid divide-border sm:grid-cols-2 sm:divide-x lg:grid-cols-3">
              {SPECS.map(([k, v]) => (
                <div key={k} className="border-b border-border p-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-1 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Classes + dataset */}
      <section className="section border-t border-border bg-muted/30">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Classes" title="What the model can recognise" />
            <ul className="mt-8 space-y-3">
              {CLASS_ORDER.map((key) => {
                const info = CLASS_INFO[key];
                return (
                  <li key={key}>
                    <Reveal className="surface flex gap-4 p-4">
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: `hsl(var(${info.colorVar}))` }}
                        aria-hidden
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{info.label}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{info.description}</p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <SectionHeading align="left" eyebrow="Data" title="Training dataset" />
            <Reveal className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                The model was trained on the public <strong className="text-foreground">Brain Tumor MRI Dataset</strong> from
                Kaggle, organised into separate <em>Training</em> and <em>Testing</em> folders with one sub-folder per class:
                glioma, meningioma, pituitary and notumor.
              </p>
              <p>
                The scans vary in quality and acquisition conditions, which makes the dataset useful for testing robustness,
                but also means results on images from other sources can differ.
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View dataset on Kaggle <ExternalLink />
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="section">
        <div className="container max-w-3xl">
          <SectionHeading align="left" eyebrow="Limitations" title="Know what it can’t do" />
          <ul className="mt-8 space-y-3">
            {LIMITATIONS.map((text) => (
              <li key={text}>
                <Reveal className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{text}</span>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-10 flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-5">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
            <p className="text-sm leading-relaxed">
              <strong>Not medical advice.</strong> This tool is for education and research. It must not be used to diagnose,
              treat or make decisions about any medical condition. Always consult a qualified healthcare professional.
            </p>
          </Reveal>

          <Button size="lg" asChild className="mt-10">
            <Link to="/#analyze">
              Try it on a scan <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default About;
