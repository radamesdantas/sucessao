'use client';

import { useAppData } from '@/hooks/useLocalStorage';
import ModuleCard from '@/components/ModuleCard';
import { PHASE_NAMES } from '@/lib/types';
import { Target } from 'lucide-react';

export default function ComportamentosPage() {
  const { data } = useAppData();

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const modules = data.behaviorModules || [];
  const completed = modules.filter((m) => m.status === 'completed').length;
  const inProgress = modules.filter((m) => m.status === 'in_progress').length;

  const phases = [1, 2, 3, 4] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Comportamentos</h1>
        <p className="text-sm text-zinc-500 mt-1">12 modulos comportamentais da Jornada Protagonista</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <Target className="h-4 w-4 text-blue-400" />
          <span className="text-xs text-zinc-400">Concluidos: <strong className="text-white">{completed}/12</strong></span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <span className="text-xs text-zinc-400">Em progresso: <strong className="text-amber-400">{inProgress}</strong></span>
        </div>
      </div>

      {phases.map((phase) => {
        const phaseModules = modules.filter((m) => m.phase === phase);
        return (
          <div key={phase}>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">
              Fase {phase} - {PHASE_NAMES[phase]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phaseModules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} basePath="/cces" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
