import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Layout } from '@/components/Layout';
import Index from './pages/Index';
import About from './pages/About';
import NotFound from './pages/NotFound';

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme" disableTransitionOnChange>
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={150}>
        <Toaster position="bottom-right" />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </ThemeProvider>
);

export default App;
