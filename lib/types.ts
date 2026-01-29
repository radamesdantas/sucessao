export interface Mentee {
  id: string;
  name: string;
  company: string;
  createdAt: string;
}

export interface CCEScore {
  id: string;
  date: string;
  scores: Record<string, number>;
}

export interface WeekData {
  week: 1 | 2 | 3 | 4;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes: string;
}

export interface Module {
  id: number;
  name: string;
  description: string;
  phase: 1 | 2 | 3 | 4;
  weeks: WeekData[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface CheckIn {
  id: string;
  date: string;
  period: '7h' | '13h' | '20h';
  responses: { question: string; answer: string }[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  insights: string;
  lastContact: string;
  category: string;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  phase: 1 | 2 | 3 | 4;
  status: 'pending' | 'in_progress' | 'completed';
  evidence: string;
  reflection: string;
}

export interface Deliverable {
  name: string;
  done: boolean;
}

export interface Project {
  id: number;
  name: string;
  area: string;
  description: string;
  month: number;
  status: 'pending' | 'in_progress' | 'completed';
  deliverables: Deliverable[];
  metrics: string;
}

export interface AppData {
  modules: Module[];
  behaviorModules: Module[];
  cceScores: CCEScore[];
  checkIns: CheckIn[];
  contacts: Contact[];
  challenges: Challenge[];
  projects: Project[];
}

export const CCE_NAMES = [
  'Busca de Oportunidades e Iniciativa',
  'Persistencia',
  'Correr Riscos Calculados',
  'Exigencia de Qualidade e Eficiencia',
  'Comprometimento',
  'Busca de Informacoes',
  'Estabelecimento de Metas',
  'Planejamento e Monitoramento Sistematico',
  'Persuasao e Rede de Contatos',
  'Independencia e Autoconfianca',
] as const;

export const PHASE_NAMES: Record<number, string> = {
  1: 'Fundacao',
  2: 'Desenvolvimento',
  3: 'Consolidacao',
  4: 'Maestria',
};

export const PHASE_COLORS: Record<number, string> = {
  1: '#3b82f6',
  2: '#f59e0b',
  3: '#10b981',
  4: '#8b5cf6',
};
