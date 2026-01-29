'use client';

import { PHASE_NAMES, PHASE_COLORS } from '@/lib/types';

interface PhaseIndicatorProps {
  currentPhase: number;
}

export default function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4].map((phase) => (
        <div key={phase} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                phase <= currentPhase
                  ? 'text-white shadow-lg'
                  : 'bg-zinc-800 text-zinc-600'
              }`}
              style={phase <= currentPhase ? { backgroundColor: PHASE_COLORS[phase] } : undefined}
            >
              {phase}
            </div>
            <span className={`mt-1 text-[10px] ${phase <= currentPhase ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {PHASE_NAMES[phase]}
            </span>
          </div>
          {phase < 4 && (
            <div
              className={`h-0.5 w-8 rounded ${
                phase < currentPhase ? 'bg-blue-500' : 'bg-zinc-800'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
