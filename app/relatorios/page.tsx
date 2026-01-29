'use client';

import { useState } from 'react';
import { useAppData, useMentee } from '@/hooks/useLocalStorage';
import { PHASE_NAMES } from '@/lib/types';
import type { AppData, Module } from '@/lib/types';
import {
  calculateOverallProgress,
  getCurrentPhase,
  getPhaseName,
  getCheckInStreak,
  getStatusLabel,
  formatDate,
} from '@/lib/utils';
import {
  Printer,
  BookOpen,
  Target,
  Users,
  Trophy,
  FolderKanban,
  LayoutGrid,
  CheckCircle2,
  Clock,
  Circle,
} from 'lucide-react';

const TABS = [
  { id: 'geral', label: 'Geral', icon: LayoutGrid },
  { id: 'gestao', label: 'Gestao', icon: BookOpen },
  { id: 'comportamentos', label: 'Comportamentos', icon: Target },
  { id: 'network', label: 'Network', icon: Users },
  { id: 'desafios', label: 'Desafios', icon: Trophy },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400 print:text-emerald-700',
    in_progress: 'bg-amber-500/20 text-amber-400 print:text-amber-700',
    pending: 'bg-zinc-700/50 text-zinc-400 print:text-gray-500',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || colors.pending}`}
    >
      {status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'in_progress' && <Clock className="h-3 w-3" />}
      {status === 'pending' && <Circle className="h-3 w-3" />}
      {getStatusLabel(status)}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-white mb-3 print:text-gray-900">
      {children}
    </h3>
  );
}

function PrintHeader({
  title,
  menteeName,
  company,
}: {
  title: string;
  menteeName: string;
  company: string;
}) {
  return (
    <div className="hidden print:block mb-6 pb-4 border-b border-gray-300">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex gap-4 mt-1 text-sm text-gray-600">
        <span>Mentorado: {menteeName}</span>
        {company && <span>Empresa: {company}</span>}
        <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
}

// --- Module Table (shared by Gestao & Comportamentos) ---

function ModuleTable({ modules, title }: { modules: Module[]; title: string }) {
  const modulesWithNotes = modules.filter((m) =>
    m.weeks.some((w) => w.notes && w.notes.trim() !== '')
  );

  return (
    <div className="space-y-6">
      <SectionTitle>{title}</SectionTitle>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 print:border-gray-300">
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">#</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Modulo</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Fase</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Status</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Semanas</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const completedWeeks = m.weeks.filter((w) => w.status === 'completed').length;
              return (
                <tr key={m.id} className="border-b border-zinc-800 print:border-gray-200">
                  <td className="py-2 px-3 text-zinc-500 print:text-gray-500">{m.id}</td>
                  <td className="py-2 px-3 text-zinc-200 print:text-gray-800">{m.name}</td>
                  <td className="py-2 px-3 text-zinc-400 print:text-gray-600">{PHASE_NAMES[m.phase]}</td>
                  <td className="py-2 px-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="py-2 px-3 text-zinc-300 print:text-gray-700">{completedWeeks}/4</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modulesWithNotes.length > 0 && (
        <div className="space-y-4 mt-6">
          <h4 className="text-sm font-semibold text-zinc-300 print:text-gray-700">
            Anotacoes por Modulo
          </h4>
          {modulesWithNotes.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 print:border-gray-300 print:bg-white"
            >
              <h5 className="text-sm font-medium text-white mb-2 print:text-gray-900">
                {m.id}. {m.name}
              </h5>
              <div className="space-y-2">
                {m.weeks
                  .filter((w) => w.notes && w.notes.trim() !== '')
                  .map((w) => (
                    <div key={w.week} className="pl-3 border-l-2 border-zinc-700 print:border-gray-300">
                      <p className="text-xs font-medium text-zinc-400 print:text-gray-500">
                        Semana {w.week} — {w.title} ({getStatusLabel(w.status)})
                      </p>
                      <p className="text-sm text-zinc-300 mt-0.5 whitespace-pre-wrap print:text-gray-700">
                        {w.notes}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Report Tab Components ---

function GeralReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  const progress = calculateOverallProgress(data);
  const phase = getCurrentPhase(data);
  const streak = getCheckInStreak(data);
  const completedGestao = data.modules.filter((m) => m.status === 'completed').length;
  const completedComport = (data.behaviorModules || []).filter((m) => m.status === 'completed').length;
  const completedDesafios = data.challenges.filter((c) => c.status === 'completed').length;
  const completedProjetos = data.projects.filter((p) => p.status === 'completed').length;

  const activeModules = data.modules.filter((m) => m.status !== 'pending');
  const activeBehaviors = (data.behaviorModules || []).filter((m) => m.status !== 'pending');
  const completedChallenges = data.challenges.filter((c) => c.status === 'completed');
  const completedProjects = data.projects.filter((p) => p.status === 'completed');

  return (
    <div className="space-y-8">
      <PrintHeader title="Relatorio Geral" menteeName={menteeName} company={company} />

      {/* Header info (screen only) */}
      <div className="print:hidden">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-zinc-400">Mentorado</span>
            <span className="text-sm text-zinc-400">
              {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{menteeName}</h2>
          {company && <p className="text-sm text-zinc-500">{company}</p>}
        </div>
      </div>

      {/* Progress & Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 print:border-gray-300 print:bg-white">
          <span className="text-sm text-zinc-400 print:text-gray-500">Progresso Geral</span>
          <p className="text-3xl font-bold text-white mt-1 print:text-gray-900">{progress}%</p>
          <div className="w-full bg-zinc-800 rounded-full h-2 mt-3 print:bg-gray-200">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 print:border-gray-300 print:bg-white">
          <span className="text-sm text-zinc-400 print:text-gray-500">Fase Atual</span>
          <p className="text-3xl font-bold text-white mt-1 print:text-gray-900">Fase {phase}</p>
          <p className="text-sm text-zinc-500 mt-1 print:text-gray-500">{getPhaseName(phase)}</p>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gestao', value: completedGestao, color: 'text-blue-400 print:text-blue-700' },
          { label: 'Comportamentos', value: completedComport, color: 'text-purple-400 print:text-purple-700' },
          { label: 'Desafios', value: completedDesafios, color: 'text-amber-400 print:text-amber-700' },
          { label: 'Projetos', value: completedProjetos, color: 'text-emerald-400 print:text-emerald-700' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center print:border-gray-300 print:bg-white"
          >
            <p className="text-sm text-zinc-400 print:text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}/12</p>
          </div>
        ))}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center print:border-gray-300 print:bg-white">
          <p className="text-sm text-zinc-400 print:text-gray-500">Check-ins</p>
          <p className="text-xl font-bold text-white mt-1 print:text-gray-900">{data.checkIns.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center print:border-gray-300 print:bg-white">
          <p className="text-sm text-zinc-400 print:text-gray-500">Contatos</p>
          <p className="text-xl font-bold text-white mt-1 print:text-gray-900">{data.contacts.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center print:border-gray-300 print:bg-white">
          <p className="text-sm text-zinc-400 print:text-gray-500">Streak</p>
          <p className="text-xl font-bold text-white mt-1 print:text-gray-900">{streak} dias</p>
        </div>
      </div>

      {/* Modules in progress/completed */}
      {activeModules.length > 0 && (
        <div>
          <SectionTitle>Modulos de Gestao</SectionTitle>
          <div className="space-y-2">
            {activeModules.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 print:border-gray-300 print:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 print:text-gray-500 w-6">{m.id}.</span>
                  <span className="text-sm text-zinc-200 print:text-gray-800">{m.name}</span>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeBehaviors.length > 0 && (
        <div>
          <SectionTitle>Modulos Comportamentais</SectionTitle>
          <div className="space-y-2">
            {activeBehaviors.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 print:border-gray-300 print:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 print:text-gray-500 w-6">{m.id}.</span>
                  <span className="text-sm text-zinc-200 print:text-gray-800">{m.name}</span>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed challenges with evidence */}
      {completedChallenges.length > 0 && (
        <div>
          <SectionTitle>Desafios Concluidos</SectionTitle>
          <div className="space-y-3">
            {completedChallenges.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 print:border-gray-300 print:bg-white"
              >
                <h4 className="text-sm font-medium text-white print:text-gray-900">{c.name}</h4>
                <p className="text-xs text-zinc-500 print:text-gray-500">
                  Fase {c.phase} — {PHASE_NAMES[c.phase]}
                </p>
                {c.evidence && (
                  <div className="mt-2">
                    <p className="text-xs text-zinc-500 print:text-gray-500">Evidencias:</p>
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap print:text-gray-700">
                      {c.evidence}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed projects with deliverables */}
      {completedProjects.length > 0 && (
        <div>
          <SectionTitle>Projetos Concluidos</SectionTitle>
          <div className="space-y-3">
            {completedProjects.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 print:border-gray-300 print:bg-white"
              >
                <h4 className="text-sm font-medium text-white print:text-gray-900">{p.name}</h4>
                <p className="text-xs text-zinc-500 print:text-gray-500">Mes {p.month}</p>
                {p.deliverables.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {p.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-zinc-300 print:text-gray-700"
                      >
                        {d.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-zinc-500 print:text-gray-400 flex-shrink-0" />
                        )}
                        {d.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GestaoReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  return (
    <div>
      <PrintHeader title="Relatorio — Gestao" menteeName={menteeName} company={company} />
      <ModuleTable modules={data.modules} title="Modulos de Gestao" />
    </div>
  );
}

function ComportamentosReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  return (
    <div>
      <PrintHeader title="Relatorio — Comportamentos" menteeName={menteeName} company={company} />
      <ModuleTable modules={data.behaviorModules || []} title="Modulos Comportamentais" />
    </div>
  );
}

function NetworkReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  const categories = Array.from(new Set(data.contacts.map((c) => c.category))).sort();

  return (
    <div className="space-y-6">
      <PrintHeader title="Relatorio — Network" menteeName={menteeName} company={company} />
      <SectionTitle>Contatos ({data.contacts.length})</SectionTitle>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {categories.map((cat) => (
            <div
              key={cat}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 print:border-gray-300 print:bg-white"
            >
              <span className="text-xs text-zinc-400 print:text-gray-500">{cat}: </span>
              <span className="text-xs font-semibold text-white print:text-gray-900">
                {data.contacts.filter((c) => c.category === cat).length}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 print:border-gray-300">
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Nome</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Cargo</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Empresa</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Categoria</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Ultimo Contato</th>
              <th className="text-left py-2 px-3 text-zinc-400 font-medium print:text-gray-600">Insights</th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map((c) => (
              <tr key={c.id} className="border-b border-zinc-800 print:border-gray-200">
                <td className="py-2 px-3 text-zinc-200 font-medium print:text-gray-800">{c.name}</td>
                <td className="py-2 px-3 text-zinc-400 print:text-gray-600">{c.role}</td>
                <td className="py-2 px-3 text-zinc-400 print:text-gray-600">{c.company}</td>
                <td className="py-2 px-3 text-zinc-400 print:text-gray-600">{c.category}</td>
                <td className="py-2 px-3 text-zinc-400 print:text-gray-600">
                  {c.lastContact ? formatDate(c.lastContact) : '—'}
                </td>
                <td className="py-2 px-3 text-zinc-300 print:text-gray-700 max-w-xs truncate">
                  {c.insights || '—'}
                </td>
              </tr>
            ))}
            {data.contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500 print:text-gray-400">
                  Nenhum contato registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DesafiosReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  const groups = [
    { label: 'Concluidos', status: 'completed', items: data.challenges.filter((c) => c.status === 'completed') },
    { label: 'Em Progresso', status: 'in_progress', items: data.challenges.filter((c) => c.status === 'in_progress') },
    { label: 'A Fazer', status: 'pending', items: data.challenges.filter((c) => c.status === 'pending') },
  ];

  return (
    <div className="space-y-8">
      <PrintHeader title="Relatorio — Desafios" menteeName={menteeName} company={company} />

      {groups.map((group) => (
        <div key={group.status}>
          <SectionTitle>
            {group.label} ({group.items.length})
          </SectionTitle>
          {group.items.length === 0 ? (
            <p className="text-sm text-zinc-500 print:text-gray-400">Nenhum desafio nesta categoria</p>
          ) : (
            <div className="space-y-3">
              {group.items.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 print:border-gray-300 print:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white print:text-gray-900">{c.name}</h4>
                      <p className="text-xs text-zinc-500 print:text-gray-500">
                        Fase {c.phase} — {PHASE_NAMES[c.phase]}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  {c.description && (
                    <p className="text-sm text-zinc-400 mt-2 print:text-gray-600">{c.description}</p>
                  )}
                  {c.evidence && (
                    <div className="mt-3 pl-3 border-l-2 border-emerald-700 print:border-emerald-400">
                      <p className="text-xs font-medium text-zinc-400 print:text-gray-500">Evidencias</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap print:text-gray-700">
                        {c.evidence}
                      </p>
                    </div>
                  )}
                  {c.reflection && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-700 print:border-blue-400">
                      <p className="text-xs font-medium text-zinc-400 print:text-gray-500">Reflexao</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap print:text-gray-700">
                        {c.reflection}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjetosReport({
  data,
  menteeName,
  company,
}: {
  data: AppData;
  menteeName: string;
  company: string;
}) {
  const groups = [
    { label: 'Concluidos', status: 'completed', items: data.projects.filter((p) => p.status === 'completed') },
    { label: 'Em Progresso', status: 'in_progress', items: data.projects.filter((p) => p.status === 'in_progress') },
    { label: 'A Fazer', status: 'pending', items: data.projects.filter((p) => p.status === 'pending') },
  ];

  return (
    <div className="space-y-8">
      <PrintHeader title="Relatorio — Projetos" menteeName={menteeName} company={company} />

      {groups.map((group) => (
        <div key={group.status}>
          <SectionTitle>
            {group.label} ({group.items.length})
          </SectionTitle>
          {group.items.length === 0 ? (
            <p className="text-sm text-zinc-500 print:text-gray-400">Nenhum projeto nesta categoria</p>
          ) : (
            <div className="space-y-3">
              {group.items.map((p) => {
                const done = p.deliverables.filter((d) => d.done).length;
                const total = p.deliverables.length;
                return (
                  <div
                    key={p.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 print:border-gray-300 print:bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white print:text-gray-900">{p.name}</h4>
                        <p className="text-xs text-zinc-500 print:text-gray-500">Mes {p.month}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    {total > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-zinc-400 mb-1.5 print:text-gray-500">
                          Entregaveis ({done}/{total})
                        </p>
                        <ul className="space-y-1">
                          {p.deliverables.map((d, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-zinc-300 print:text-gray-700"
                            >
                              {d.done ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 print:text-emerald-600" />
                              ) : (
                                <Circle className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0 print:text-gray-400" />
                              )}
                              <span className={d.done ? '' : 'text-zinc-500 print:text-gray-400'}>
                                {d.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {p.metrics && (
                      <div className="mt-3 pl-3 border-l-2 border-zinc-700 print:border-gray-300">
                        <p className="text-xs font-medium text-zinc-400 print:text-gray-500">Metricas</p>
                        <p className="text-sm text-zinc-300 whitespace-pre-wrap print:text-gray-700">
                          {p.metrics}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main Page ---

export default function RelatoriosPage() {
  const { data } = useAppData();
  const { mentee } = useMentee();
  const [activeTab, setActiveTab] = useState('geral');

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-zinc-500">Carregando...</div>
      </div>
    );
  }

  const menteeName = mentee?.name || 'Mentorado';
  const company = mentee?.company || '';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatorios</h1>
          <p className="text-sm text-zinc-500 mt-1">Relatorios detalhados por area</p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800 overflow-x-auto no-print">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'geral' && (
          <GeralReport data={data} menteeName={menteeName} company={company} />
        )}
        {activeTab === 'gestao' && (
          <GestaoReport data={data} menteeName={menteeName} company={company} />
        )}
        {activeTab === 'comportamentos' && (
          <ComportamentosReport data={data} menteeName={menteeName} company={company} />
        )}
        {activeTab === 'network' && (
          <NetworkReport data={data} menteeName={menteeName} company={company} />
        )}
        {activeTab === 'desafios' && (
          <DesafiosReport data={data} menteeName={menteeName} company={company} />
        )}
        {activeTab === 'projetos' && (
          <ProjetosReport data={data} menteeName={menteeName} company={company} />
        )}
      </div>
    </div>
  );
}
