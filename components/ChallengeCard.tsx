'use client';

import { Trophy, Check, Clock, Circle } from 'lucide-react';
import { Challenge, PHASE_COLORS } from '@/lib/types';
import { getStatusLabel } from '@/lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  onStatusChange?: (status: 'pending' | 'in_progress' | 'completed') => void;
  onEdit?: () => void;
}

export default function ChallengeCard({ challenge, onStatusChange, onEdit }: ChallengeCardProps) {
  const StatusIcon = challenge.status === 'completed' ? Check : challenge.status === 'in_progress' ? Clock : Circle;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: PHASE_COLORS[challenge.phase] }}
          >
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{challenge.name}</h3>
            <p className="text-[11px] text-zinc-500">Fase {challenge.phase} - {getStatusLabel(challenge.status)}</p>
          </div>
        </div>
        <StatusIcon className={`h-4 w-4 ${
          challenge.status === 'completed' ? 'text-emerald-400' :
          challenge.status === 'in_progress' ? 'text-amber-400' : 'text-zinc-600'
        }`} />
      </div>
      <p className="text-xs text-zinc-400 mb-3">{challenge.description}</p>
      <div className="flex gap-2">
        {onStatusChange && challenge.status === 'pending' && (
          <button
            onClick={() => onStatusChange('in_progress')}
            className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
          >
            Iniciar
          </button>
        )}
        {onStatusChange && challenge.status === 'in_progress' && (
          <button
            onClick={() => onStatusChange('completed')}
            className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
          >
            Concluir
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[11px] px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Detalhes
          </button>
        )}
      </div>
    </div>
  );
}
