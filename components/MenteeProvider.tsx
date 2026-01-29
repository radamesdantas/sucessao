'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Mentee } from '@/lib/types';
import { loadMentees, getCurrentMenteeId, setCurrentMenteeId as persistMenteeId, pullMenteesFromSheets } from '@/lib/storage';
import { MenteeContext } from '@/hooks/useLocalStorage';
import MenteeSelector from './MenteeSelector';

export default function MenteeProvider({ children }: { children: ReactNode }) {
  const [menteeId, setMenteeIdState] = useState<string | null>(null);
  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedId = getCurrentMenteeId();
    if (storedId) {
      const mentees = loadMentees();
      const found = mentees.find((m) => m.id === storedId);
      if (found) {
        setMenteeIdState(storedId);
        setMentee(found);
      }
    }
    setReady(true);

    pullMenteesFromSheets().then((sheetsMentees) => {
      if (sheetsMentees) {
        const currentId = getCurrentMenteeId();
        if (currentId) {
          const found = sheetsMentees.find((m) => m.id === currentId);
          if (found) setMentee(found);
        }
      }
    });
  }, []);

  const setMenteeId = (id: string | null) => {
    persistMenteeId(id);
    setMenteeIdState(id);
    if (id) {
      const mentees = loadMentees();
      setMentee(mentees.find((m) => m.id === id) || null);
    } else {
      setMentee(null);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    );
  }

  if (!menteeId) {
    return <MenteeSelector onSelect={setMenteeId} />;
  }

  return (
    <MenteeContext.Provider value={{ menteeId, mentee, setMenteeId }}>
      {children}
    </MenteeContext.Provider>
  );
}
