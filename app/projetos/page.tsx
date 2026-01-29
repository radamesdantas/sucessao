'use client';

import { useAppData } from '@/hooks/useLocalStorage';
import { updateProject } from '@/lib/storage';
import { getStatusBg } from '@/lib/utils';
import { FolderKanban, Check, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ProjetosPage() {
  const { data, refreshData, menteeId } = useAppData();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const statusGroups = {
    in_progress: data.projects.filter((p) => p.status === 'in_progress'),
    pending: data.projects.filter((p) => p.status === 'pending'),
    completed: data.projects.filter((p) => p.status === 'completed'),
  };

  const handleStatusChange = (id: number, status: 'pending' | 'in_progress' | 'completed') => {
    if (!menteeId) return;
    updateProject(menteeId, id, { status });
    refreshData();
  };

  const handleDeliverableToggle = (projectId: number, deliverableIndex: number) => {
    if (!menteeId) return;
    const project = data.projects.find((p) => p.id === projectId);
    if (!project) return;
    const deliverables = project.deliverables.map((d, i) =>
      i === deliverableIndex ? { ...d, done: !d.done } : d
    );
    updateProject(menteeId, projectId, { deliverables });
    refreshData();
  };

  const columns = [
    { key: 'pending', label: 'A Fazer', color: 'zinc', items: statusGroups.pending },
    { key: 'in_progress', label: 'Fazendo', color: 'amber', items: statusGroups.in_progress },
    { key: 'completed', label: 'Feito', color: 'emerald', items: statusGroups.completed },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Projetos</h1>
        <p className="text-sm text-zinc-500 mt-1">12 projetos gerenciais - 1 por mes</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <FolderKanban className="h-4 w-4 text-emerald-400" />
          <span className="text-xs text-zinc-400">Concluidos: <strong className="text-white">{statusGroups.completed.length}/12</strong></span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <span className="text-xs text-zinc-400">Em andamento: <strong className="text-amber-400">{statusGroups.in_progress.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(({ key, label, color, items }) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
              <h2 className="text-sm font-semibold text-zinc-300">{label}</h2>
              <span className="text-[10px] text-zinc-600 ml-auto">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((project) => {
                const isExpanded = expandedId === project.id;
                const completedDeliverables = project.deliverables.filter((d) => d.done).length;
                return (
                  <div key={project.id} className={`rounded-xl border p-4 transition-all ${getStatusBg(project.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                        <p className="text-[11px] text-zinc-500">Mes {project.month} - {project.area}</p>
                      </div>
                      <button onClick={() => setExpandedId(isExpanded ? null : project.id)} className="text-zinc-500 hover:text-white">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{project.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-zinc-500">Entregaveis: {completedDeliverables}/{project.deliverables.length}</span>
                      <span className="text-[10px] text-zinc-500">{project.metrics}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-zinc-800">
                      <div className="h-1 rounded-full bg-blue-500 transition-all" style={{ width: `${project.deliverables.length > 0 ? (completedDeliverables / project.deliverables.length) * 100 : 0}%` }} />
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-2">
                        {project.deliverables.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => handleDeliverableToggle(project.id, i)}
                            className="flex items-center gap-2 w-full text-left"
                          >
                            {d.done ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                            )}
                            <span className={`text-xs ${d.done ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{d.name}</span>
                          </button>
                        ))}
                        <div className="flex gap-2 mt-3">
                          {project.status === 'pending' && (
                            <button onClick={() => handleStatusChange(project.id, 'in_progress')} className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">Iniciar</button>
                          )}
                          {project.status === 'in_progress' && (
                            <button onClick={() => handleStatusChange(project.id, 'completed')} className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">Concluir</button>
                          )}
                          {project.status !== 'pending' && (
                            <button onClick={() => handleStatusChange(project.id, 'pending')} className="text-[11px] px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors">Reabrir</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-600">
                  Nenhum projeto
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
