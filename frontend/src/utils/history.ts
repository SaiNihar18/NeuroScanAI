import { useSyncExternalStore } from 'react';
import { HistoryItem } from '@/types/prediction';

const HISTORY_KEY = 'neuroscan-history';
const MAX_HISTORY = 8;

let cache: HistoryItem[] | null = null;
const listeners = new Set<() => void>();

const load = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.predictedClass && i.thumbnail) : [];
  } catch {
    return [];
  }
};

const persist = (items: HistoryItem[]) => {
  // Drop the oldest entries until it fits in the storage quota.
  let toSave = items;
  while (toSave.length > 0) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(toSave));
      return;
    } catch {
      toSave = toSave.slice(0, -1);
    }
  }
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* storage unavailable: history lives in memory only */
  }
};

const set = (items: HistoryItem[]) => {
  cache = items;
  persist(items);
  listeners.forEach((l) => l());
};

const getSnapshot = (): HistoryItem[] => (cache ??= load());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === HISTORY_KEY) {
      cache = load();
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
};

export const useHistory = (): HistoryItem[] => useSyncExternalStore(subscribe, getSnapshot, () => []);

export const addToHistory = (item: Omit<HistoryItem, 'id'>): void => {
  const id = `${item.timestamp}-${Math.random().toString(36).slice(2, 7)}`;
  set([{ ...item, id }, ...getSnapshot()].slice(0, MAX_HISTORY));
};

export const removeFromHistory = (id: string): void => set(getSnapshot().filter((i) => i.id !== id));

export const clearHistory = (): void => set([]);

/** Downscale an image URL to a small JPEG data URL so history stays tiny. */
export const createThumbnail = (src: string, maxSize = 256): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas unavailable'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => reject(new Error('Could not read image'));
    img.src = src;
  });
