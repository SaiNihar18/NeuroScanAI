import { History, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getClassInfo } from '@/lib/classes';
import { HistoryItem } from '@/types/prediction';
import { clearHistory, removeFromHistory, useHistory } from '@/utils/history';
import { formatPercent, timeAgo } from '@/utils/format';
import { SectionHeading } from './Reveal';

interface Props {
  onSelect: (item: HistoryItem) => void;
}

export const HistorySection = ({ onSelect }: Props) => {
  const history = useHistory();

  return (
    <section id="history" className="section border-t border-border bg-muted/30">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="History"
            title="Recent analyses"
            description="Stored only in this browser. Select one to view it again."
          />

          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="self-start sm:self-auto">
                  <Trash2 /> Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all saved analyses from this browser. It cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      clearHistory();
                      toast.success('History cleared');
                    }}
                  >
                    Clear history
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {history.length === 0 ? (
          <div className="surface mt-10 flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <History className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 font-medium">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Your analyzed scans will appear here.</p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {history.map((item) => {
              const info = getClassInfo(item.predictedClass);
              return (
                <li key={item.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="surface w-full overflow-hidden text-left transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="aspect-[4/3] bg-black">
                      <img
                        src={item.thumbnail}
                        alt={`Scan analyzed as ${info.label}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: `hsl(var(${info.colorVar}))` }}
                          aria-hidden
                        />
                        <p className="truncate text-sm font-semibold">{info.label}</p>
                      </div>
                      <p className="num mt-1 text-xs text-muted-foreground">
                        {formatPercent(item.confidence, 0)} · {timeAgo(item.timestamp)}
                      </p>
                    </div>
                  </button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 shadow-card transition-opacity focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                    aria-label={`Delete analysis: ${info.label}`}
                    onClick={() => removeFromHistory(item.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};
