'use client';

import { useAppData } from '@/hooks/useLocalStorage';
import {
  calculateOverallProgress,
  getCurrentPhase,
  getSovereigntyIndex,
  getPhaseName,
} from '@/lib/utils';
import MetricCard from '@/components/MetricCard';
import ProgressCard from '@/components/ProgressCard';
import {
  Trophy,
  FolderKanban,
  Users,
  BookOpen,
  MessageSquare,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MetricasPage() {
  const { data } = useAppData();

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const progress = calculateOverallProgress(data);
  const phase = getCurrentPhase(data);
  const sovereignty = getSovereigntyIndex(data);
  const completedChallenges = data.challenges.filter((c) => c.status === 'completed').length;
  const completedProjects = data.projects.filter((p) => p.status === 'completed').length;
  const completedModules = data.modules.filter((m) => m.status === 'completed').length;
  const behaviorModules = data.behaviorModules || [];
  const completedBehaviors = behaviorModules.filter((m) => m.status === 'completed').length;

  const checkInsByDate = data.checkIns.reduce<Record<string, number>>((acc, ci) => {
    acc[ci.date] = (acc[ci.date] || 0) + 1;
    return acc;
  }, {});
  const checkInChartData = Object.entries(checkInsByDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({
      date: date.slice(5),
      checkins: count,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Metricas</h1>
        <p className="text-sm text-zinc-500 mt-1">KPIs e indicadores do programa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard label="Progresso Geral" value={progress} color="blue" />
        <ProgressCard label="Indice de Soberania" value={sovereignty} color="purple" />
        <ProgressCard label="Comportamentos" value={completedBehaviors} max={12} suffix="/12" color="emerald" />
        <ProgressCard label="Fase Atual" value={phase} max={4} suffix={` - ${getPhaseName(phase)}`} color="amber" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard icon={BookOpen} label="Gestao" value={`${completedModules}/12`} color="purple" />
        <MetricCard icon={Target} label="Comportamentos" value={`${completedBehaviors}/12`} color="blue" />
        <MetricCard icon={Trophy} label="Desafios" value={`${completedChallenges}/12`} color="amber" />
        <MetricCard icon={FolderKanban} label="Projetos" value={`${completedProjects}/12`} color="emerald" />
        <MetricCard icon={Users} label="Network" value={data.contacts.length} color="blue" />
        <MetricCard icon={MessageSquare} label="Check-ins" value={data.checkIns.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Progresso Gestao por Fase</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[1, 2, 3, 4].map((p) => {
                const pm = data.modules.filter((m) => m.phase === p);
                return {
                  fase: `Fase ${p}`,
                  concluidos: pm.filter((m) => m.status === 'completed').length,
                  total: pm.length,
                };
              })}
              margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="fase" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis domain={[0, 3]} tick={{ fill: '#52525b', fontSize: 10 }} tickCount={4} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Bar dataKey="concluidos" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Concluidos" />
              <Bar dataKey="total" fill="#27272a" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Progresso Comportamentos por Fase</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[1, 2, 3, 4].map((p) => {
                const pm = behaviorModules.filter((m) => m.phase === p);
                return {
                  fase: `Fase ${p}`,
                  concluidos: pm.filter((m) => m.status === 'completed').length,
                  total: pm.length,
                };
              })}
              margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="fase" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis domain={[0, 3]} tick={{ fill: '#52525b', fontSize: 10 }} tickCount={4} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Bar dataKey="concluidos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Concluidos" />
              <Bar dataKey="total" fill="#27272a" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {checkInChartData.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Check-ins por Dia (ultimos 30 dias)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={checkInChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 9 }} />
              <YAxis domain={[0, 3]} tick={{ fill: '#52525b', fontSize: 10 }} tickCount={4} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Bar dataKey="checkins" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Resumo por Fase</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((phase) => {
            const phaseModules = data.modules.filter((m) => m.phase === phase);
            const phaseBehaviors = behaviorModules.filter((m) => m.phase === phase);
            const phaseChallenges = data.challenges.filter((c) => c.phase === phase);
            const modDone = phaseModules.filter((m) => m.status === 'completed').length;
            const behDone = phaseBehaviors.filter((m) => m.status === 'completed').length;
            const chDone = phaseChallenges.filter((c) => c.status === 'completed').length;
            return (
              <div key={phase} className="rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
                <h3 className="text-xs font-semibold text-zinc-300 mb-3">Fase {phase} - {getPhaseName(phase)}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Gestao</span>
                    <span className="text-white">{modDone}/{phaseModules.length}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Comportamentos</span>
                    <span className="text-white">{behDone}/{phaseBehaviors.length}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Desafios</span>
                    <span className="text-white">{chDone}/{phaseChallenges.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
