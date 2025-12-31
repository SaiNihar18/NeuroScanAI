import { HistoryItem } from '@/types/prediction';

const HISTORY_KEY = 'brain-tumor-history';
const MAX_HISTORY = 5;

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToHistory = (item: Omit<HistoryItem, 'id'>): void => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
  };
  
  const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
