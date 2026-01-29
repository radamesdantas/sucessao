import { AppData, PHASE_NAMES } from './types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function calculateOverallProgress(data: AppData): number {
  const moduleProgress = data.modules.reduce((acc, m) => {
    if (m.status === 'completed') return acc + 1;
    if (m.status === 'in_progress') return acc + 0.5;
    return acc;
  }, 0) / 12;

  const challengeProgress = data.challenges.filter((c) => c.status === 'completed').length / 12;
  const projectProgress = data.projects.filter((p) => p.status === 'completed').length / 12;

  return Math.round(((moduleProgress + challengeProgress + projectProgress) / 3) * 100);
}

export function getCurrentPhase(data: AppData): number {
  const completedModules = data.modules.filter((m) => m.status === 'completed').length;
  if (completedModules >= 10) return 4;
  if (completedModules >= 7) return 3;
  if (completedModules >= 4) return 2;
  return 1;
}

export function getPhaseName(phase: number): string {
  return PHASE_NAMES[phase] || 'Fundacao';
}

export function getLatestCCEScores(data: AppData): Record<string, number> | null {
  if (data.cceScores.length === 0) return null;
  const sorted = [...data.cceScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0].scores;
}

export function getAverageCCEScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
}

export function getCheckInStreak(data: AppData): number {
  if (data.checkIns.length === 0) return 0;
  const dates = Array.from(new Set(data.checkIns.map((c) => c.date))).sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(dates[i]);
    checkDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getSovereigntyIndex(data: AppData): number {
  const completedChallenges = data.challenges.filter((c) => c.status === 'completed').length;
  const completedProjects = data.projects.filter((p) => p.status === 'completed').length;
  const totalCheckins = data.checkIns.length;
  const cceAvg = data.cceScores.length > 0
    ? getAverageCCEScore(data.cceScores[data.cceScores.length - 1].scores)
    : 4.3;

  const score = (
    (completedChallenges / 12) * 25 +
    (completedProjects / 12) * 25 +
    Math.min(totalCheckins / 100, 1) * 25 +
    (cceAvg / 10) * 25
  );
  return Math.round(score);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-emerald-400';
    case 'in_progress': return 'text-amber-400';
    default: return 'text-zinc-500';
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 border-emerald-500/30';
    case 'in_progress': return 'bg-amber-500/20 border-amber-500/30';
    default: return 'bg-zinc-800/50 border-zinc-700/50';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return 'Concluido';
    case 'in_progress': return 'Em Progresso';
    default: return 'Pendente';
  }
}

export function getCCEShortName(name: string): string {
  const map: Record<string, string> = {
    'Busca de Oportunidades e Iniciativa': 'Oportunidades',
    'Persistencia': 'Persistencia',
    'Correr Riscos Calculados': 'Riscos',
    'Exigencia de Qualidade e Eficiencia': 'Qualidade',
    'Comprometimento': 'Compromisso',
    'Busca de Informacoes': 'Informacoes',
    'Estabelecimento de Metas': 'Metas',
    'Planejamento e Monitoramento Sistematico': 'Planejamento',
    'Persuasao e Rede de Contatos': 'Persuasao',
    'Independencia e Autoconfianca': 'Autoconfianca',
  };
  return map[name] || name;
}
