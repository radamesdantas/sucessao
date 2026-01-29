'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/useLocalStorage';
import { updateChallenge } from '@/lib/storage';
import { getStatusBg } from '@/lib/utils';
import { PHASE_NAMES, PHASE_COLORS } from '@/lib/types';
import { Trophy, ChevronDown, ChevronUp, Save } from 'lucide-react';

export default function DesafiosPage() {
  const { data, refreshData, menteeId } = useAppData();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [evidence, setEvidence] = useState('');
  const [reflection, setReflection] = useState('');

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const statusGroups = {
    in_progress: data.challenges.filter((c) => c.status === 'in_progress'),
    pending: data.challenges.filter((c) => c.status === 'pending'),
    completed: data.challenges.filter((c) => c.status === 'completed'),
  };

  const handleStatusChange = (id: number, status: 'pending' | 'in_progress' | 'completed') => {
    if (!menteeId) return;
    updateChallenge(menteeId, id, { status });
    refreshData();
  };

  const handleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      const challenge = data.challenges.find((c) => c.id === id);
      if (challenge) {
        setEvidence(challenge.evidence);
        setReflection(challenge.reflection);
        setExpandedId(id);
      }
    }
  };

  const handleSaveDetails = (id: number) => {
    if (!menteeId) return;
    updateChallenge(menteeId, id, { evidence, reflection });
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
        <h1 className="text-2xl font-bold text-white">Desafios</h1>
        <p className="text-sm text-zinc-500 mt-1">12 desafios comportamentais do programa</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
          <Trophy className="h-4 w-4 text-emerald-400" />
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
              {items.map((challenge) => {
                const isExpanded = expandedId === challenge.id;
                return (
                  <div key={challenge.id} className={`rounded-xl border p-4 transition-all ${getStatusBg(challenge.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{challenge.name}</h3>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: PHASE_COLORS[challenge.phase] }}
                          />
                          Fase {challenge.phase} - {PHASE_NAMES[challenge.phase]}
                        </p>
                      </div>
                      <button onClick={() => handleExpand(challenge.id)} className="text-zinc-500 hover:text-white">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{challenge.description}</p>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-3">
                        <div>
                          <label className="text-[11px] text-zinc-500 mb-1 block">Evidencias</label>
                          <textarea
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="Descreva as evidencias..."
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-zinc-500 mb-1 block">Reflexao</label>
                          <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="O que voce aprendeu..."
                          />
                        </div>
                        <button
                          onClick={() => handleSaveDetails(challenge.id)}
                          className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                        >
                          <Save className="h-3 w-3" />
                          Salvar notas
                        </button>
                        <div className="flex gap-2 pt-1">
                          {challenge.status === 'pending' && (
                            <button onClick={() => handleStatusChange(challenge.id, 'in_progress')} className="text-[11px] px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors">Iniciar</button>
                          )}
                          {challenge.status === 'in_progress' && (
                            <button onClick={() => handleStatusChange(challenge.id, 'completed')} className="text-[11px] px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">Concluir</button>
                          )}
                          {challenge.status !== 'pending' && (
                            <button onClick={() => handleStatusChange(challenge.id, 'pending')} className="text-[11px] px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors">Reabrir</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-600">
                  Nenhum desafio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
