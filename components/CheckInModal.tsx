'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { CHECKIN_QUESTIONS } from '@/lib/data';
import { CheckIn } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkIn: CheckIn) => void;
  period: '7h' | '13h' | '20h';
}

export default function CheckInModal({ isOpen, onClose, onSave, period }: CheckInModalProps) {
  const questions = CHECKIN_QUESTIONS[period];
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));

  if (!isOpen) return null;

  const handleSave = () => {
    const checkIn: CheckIn = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      period,
      responses: questions.map((q, i) => ({ question: q, answer: answers[i] })),
    };
    onSave(checkIn);
    setAnswers(questions.map(() => ''));
    onClose();
  };

  const periodLabels: Record<string, string> = {
    '7h': 'Manha (7h)',
    '13h': 'Tarde (13h)',
    '20h': 'Noite (20h)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Check-in {periodLabels[period]}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i}>
              <label className="block text-sm text-zinc-300 mb-1.5">{q}</label>
              <textarea
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                rows={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Sua resposta..."
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={answers.some((a) => !a.trim())}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Salvar Check-in
          </button>
        </div>
      </div>
    </div>
  );
}
