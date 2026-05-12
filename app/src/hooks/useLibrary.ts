import { useState, useEffect, useCallback } from 'react';

export interface LibraryItem {
  id: string;
  query: string;
  synthesis: string;
  timestamp: number;
  topics: string[];
}

export function useLibrary() {
  const [items, setItems] = useState<LibraryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('luma_library') || '[]');
    } catch {
      return [];
    }
  });

  const saveItem = useCallback((query: string, synthesis: string, topics: string[]) => {
    setItems((prev) => {
      const newItem: LibraryItem = {
        id: Math.random().toString(36).substring(2, 9),
        query,
        synthesis,
        timestamp: Date.now(),
        topics,
      };
      const next = [newItem, ...prev];
      localStorage.setItem('luma_library', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      localStorage.setItem('luma_library', JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((query: string) => {
    return items.some((item) => item.query.toLowerCase() === query.toLowerCase());
  }, [items]);

  return { items, saveItem, removeItem, isSaved };
}
