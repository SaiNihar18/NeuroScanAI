import { useEffect } from 'react';

const BRAND = 'NeuroScan AI';

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND}` : `${BRAND} · Brain tumor MRI classification`;
  }, [title]);
};
