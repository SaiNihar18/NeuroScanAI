import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <span className={cn('inline-flex items-center gap-2.5 font-semibold tracking-tight', className)}>
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <Brain className="h-[18px] w-[18px]" aria-hidden />
    </span>
    <span className="text-[17px]">
      NeuroScan<span className="text-primary"> AI</span>
    </span>
  </span>
);
