'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAppData } from '@/hooks/useLocalStorage';
import { updateModule } from '@/lib/storage';
import { PHASE_COLORS, PHASE_NAMES } from '@/lib/types';
import { getStatusLabel, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Check, Clock, Circle, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, refreshData, menteeId } = useAppData();
  const [notes, setNotes] = useState<Record<number, string>>({});

  const moduleId = Number(params.id);

  useEffect(() => {
    if (data) {
      const mod = data.modules.find((m) => m.id === moduleId);
      if (mod) {
        const n: Record<number, string> = {};
        mod.weeks.forEach((w) => { n[w.week] = w.notes; });
        setNotes(n);
      }
    }
  }, [data, moduleId]);

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const mod = data.modules.find((m) => m.id === moduleId);
  if (!mod) {
    return <div className="text-zinc-500">Modulo nao encontrado</div>;
  }

  const handleWeekStatus = (weekNum: 1 | 2 | 3 | 4, status: 'pending' | 'in_progress' | 'completed') => {
    if (!menteeId) return;
    const updatedWeeks = mod.weeks.map((w) =>
      w.week === weekNum ? { ...w, status } : w
    );
    const allCompleted = updatedWeeks.every((w) => w.status === 'completed');
    const anyInProgress = updatedWeeks.some((w) => w.status === 'in_progress' || w.status === 'completed');
    const moduleStatus = allCompleted ? 'completed' : anyInProgress ? 'in_progress' : 'pending';
    updateModule(menteeId, moduleId, { weeks: updatedWeeks, status: moduleStatus } as never);
    refreshData();
  };

  const handleSaveNotes = (weekNum: number) => {
    if (!menteeId) return;
    const updatedWeeks = mod.weeks.map((w) =>
      w.week === weekNum ? { ...w, notes: notes[weekNum] || '' } : w
    );
    updateModule(menteeId, moduleId, { weeks: updatedWeeks } as never);
    refreshData();
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'completed') return <Check className="h-4 w-4 text-emerald-400" />;
    if (status === 'in_progress') return <Clock className="h-4 w-4 text-amber-400" />;
    return <Circle className="h-4 w-4 text-zinc-600" />;
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/modulos')}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar a Gestao
      </button>

      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold"
          style={{ backgroundColor: PHASE_COLORS[mod.phase] }}
        >
          {mod.id}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{mod.name}</h1>
          <p className="text-sm text-zinc-500 mt-1">{mod.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-zinc-500">Fase {mod.phase} - {PHASE_NAMES[mod.phase]}</span>
            <span className={`text-xs ${getStatusColor(mod.status)}`}>{getStatusLabel(mod.status)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {mod.weeks.map((w) => (
          <div
            key={w.week}
            className={`h-2 flex-1 rounded-full ${
              w.status === 'completed' ? 'bg-emerald-500' :
              w.status === 'in_progress' ? 'bg-amber-500' : 'bg-zinc-700'
            }`}
          />
        ))}
      </div>

      <div className="space-y-4">
        {mod.weeks.map((w) => (
          <div key={w.week} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <StatusIcon status={w.status} />
                <div>
                  <h3 className="text-sm font-semibold text-white">Semana {w.week}</h3>
                  <p className="text-xs text-zinc-400">{w.title}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {w.status === 'pending' && (
                  <button
                    onClick={() => handleWeekStatus(w.week, 'in_progress')}
                    className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                  >
                    Iniciar
                  </button>
                )}
                {w.status === 'in_progress' && (
                  <button
                    onClick={() => handleWeekStatus(w.week, 'completed')}
                    className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    Concluir
                  </button>
                )}
                {w.status === 'completed' && (
                  <button
                    onClick={() => handleWeekStatus(w.week, 'pending')}
                    className="text-[11px] px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
                  >
                    Reabrir
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Anotacoes</label>
              <textarea
                value={notes[w.week] || ''}
                onChange={(e) => setNotes({ ...notes, [w.week]: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Suas anotacoes sobre esta semana..."
              />
              <button
                onClick={() => handleSaveNotes(w.week)}
                className="mt-2 flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
              >
                <Save className="h-3 w-3" />
                Salvar notas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
