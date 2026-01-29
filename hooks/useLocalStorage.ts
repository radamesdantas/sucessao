'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Mentee } from '@/lib/types';
import { loadData, saveData, pullDataFromSheets } from '@/lib/storage';

interface MenteeContextValue {
  menteeId: string | null;
  mentee: Mentee | null;
  setMenteeId: (id: string | null) => void;
}

export const MenteeContext = createContext<MenteeContextValue>({
  menteeId: null,
  mentee: null,
  setMenteeId: () => {},
});

export function useMentee() {
  return useContext(MenteeContext);
}

export function useAppData() {
  const { menteeId } = useMentee();
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    if (menteeId) {
      setData(loadData(menteeId));
      pullDataFromSheets(menteeId).then((sheetsData) => {
        if (sheetsData) setData(sheetsData);
      });
    }
  }, [menteeId]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    if (!menteeId) return;
    setData((prev) => {
      const current = prev || loadData(menteeId);
      const next = updater(current);
      saveData(menteeId, next);
      return next;
    });
  }, [menteeId]);

  const refreshData = useCallback(() => {
    if (menteeId) {
      setData(loadData(menteeId));
    }
  }, [menteeId]);

  return { data, updateData, refreshData, menteeId };
}
