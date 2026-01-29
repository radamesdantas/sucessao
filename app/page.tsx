'use client';

import { useAppData } from '@/hooks/useLocalStorage';
import {
  calculateOverallProgress,
  getCurrentPhase,
  getCheckInStreak,
  getSovereigntyIndex,
  formatDate,
} from '@/lib/utils';
import PhaseIndicator from '@/components/PhaseIndicator';
import ProgressCard from '@/components/ProgressCard';
import MetricCard from '@/components/MetricCard';
import {
  Target,
  Flame,
  Trophy,
  FolderKanban,
  Shield,
  MessageSquare,
} from 'lucide-react';

export default function Dashboard() {
  const { data } = useAppData();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    );
  }

  const progress = calculateOverallProgress(data);
  const phase = getCurrentPhase(data);
  const streak = getCheckInStreak(data);
  const sovereignty = getSovereigntyIndex(data);
  const completedBehaviors = (data.behaviorModules || []).filter((m) => m.status === 'completed').length;
  const completedChallenges = data.challenges.filter((c) => c.status === 'completed').length;
  const completedProjects = data.projects.filter((p) => p.status === 'completed').length;
  const lastCheckIn = data.checkIns.length > 0
    ? data.checkIns[data.checkIns.length - 1]
    : null;
  const nextChallenge = data.challenges.find((c) => c.status === 'pending');
  const nextProject = data.projects.find((p) => p.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Visao geral da Jornada Protagonista</p>
      </div>

      <PhaseIndicator currentPhase={phase} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard label="Progresso Geral" value={progress} color="blue" />
        <ProgressCard label="Gestao" value={data.modules.filter((m) => m.status === 'completed').length} max={12} suffix="/12" color="purple" />
        <ProgressCard label="Desafios" value={completedChallenges} max={12} suffix="/12" color="amber" />
        <ProgressCard label="Projetos" value={completedProjects} max={12} suffix="/12" color="emerald" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Target} label="Comportamentos" value={`${completedBehaviors}/12`} sublabel="Modulos concluidos" color="blue" />
        <MetricCard icon={Flame} label="Streak Check-ins" value={`${streak} dias`} sublabel="Dias consecutivos" color="amber" />
        <MetricCard icon={Shield} label="Indice de Soberania" value={`${sovereignty}%`} sublabel="Autonomia gerencial" color="purple" />
        <MetricCard icon={MessageSquare} label="Total Check-ins" value={data.checkIns.length} sublabel="Registros feitos" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {lastCheckIn && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h2 className="text-sm font-semibold text-white mb-2">Ultimo Check-in</h2>
              <p className="text-xs text-zinc-500 mb-3">{formatDate(lastCheckIn.date)} - {lastCheckIn.period}</p>
              {lastCheckIn.responses.slice(0, 2).map((r, i) => (
                <div key={i} className="mb-2">
                  <p className="text-[11px] text-zinc-500">{r.question}</p>
                  <p className="text-xs text-zinc-300">{r.answer}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {nextChallenge && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-semibold text-white">Proximo Desafio</h3>
                </div>
                <p className="text-xs text-zinc-400">{nextChallenge.name}</p>
                <p className="text-[10px] text-zinc-600 mt-1">Fase {nextChallenge.phase}</p>
              </div>
            )}
            {nextProject && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FolderKanban className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-xs font-semibold text-white">Proximo Projeto</h3>
                </div>
                <p className="text-xs text-zinc-400">{nextProject.name}</p>
                <p className="text-[10px] text-zinc-600 mt-1">Mes {nextProject.month}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
