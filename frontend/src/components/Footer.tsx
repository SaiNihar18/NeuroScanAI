import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { Logo } from './Logo';

const REPO_URL = 'https://github.com/SaiNihar18/NeuroScanAI';

export const Footer = () => (
  <footer className="border-t border-border bg-card/40">
    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A deep-learning demo that classifies brain MRI scans into four categories using an Xception-based model.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/#analyze" className="transition-colors hover:text-foreground">
                Analyze a scan
              </Link>
            </li>
            <li>
              <Link to="/#how-it-works" className="transition-colors hover:text-foreground">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About the model
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Project</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" aria-hidden /> Source on GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Training dataset (Kaggle)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} NeuroScan AI</p>
        <p>For educational and research purposes only. Not a medical device and not for clinical diagnosis.</p>
      </div>
    </div>
  </footer>
);
