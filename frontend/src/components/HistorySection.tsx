import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHistory, clearHistory } from '@/utils/history';
import { HistoryItem } from '@/types/prediction';
import { toast } from 'sonner';

export const HistorySection = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast.success('History cleared');
  };

  if (history.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Recent Analysis</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card rounded-xl overflow-hidden shadow-lg border border-border"
            >
              <div className="aspect-square bg-muted">
                <img
                  src={item.imageUrl}
                  alt={`Analysis ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-lg mb-1">{item.class}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Confidence: {Math.round(item.confidence * 100)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()} at{' '}
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
