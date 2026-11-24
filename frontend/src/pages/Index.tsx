import { useCallback, useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisWorkspace } from '@/components/AnalysisWorkspace';
import { HowItWorks } from '@/components/HowItWorks';
import { HistorySection } from '@/components/HistorySection';
import { usePageTitle } from '@/hooks/use-page-title';
import { HistoryItem } from '@/types/prediction';

const Index = () => {
  usePageTitle();
  const [viewing, setViewing] = useState<HistoryItem | null>(null);

  const handleSelect = useCallback((item: HistoryItem) => {
    setViewing(item);
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const clearViewing = useCallback(() => setViewing(null), []);

  return (
    <>
      <Hero />
      <AnalysisWorkspace viewing={viewing} onViewingConsumed={clearViewing} />
      <HowItWorks />
      <HistorySection onSelect={handleSelect} />
    </>
  );
};

export default Index;
