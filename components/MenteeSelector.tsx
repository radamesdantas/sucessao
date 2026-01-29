'use client';

import { useState, useEffect } from 'react';
import { Mentee } from '@/lib/types';
import { loadMentees, saveMentees, deleteMentee } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { GraduationCap, Plus, Trash2, Building2, User } from 'lucide-react';

interface MenteeSelectorProps {
  onSelect: (menteeId: string) => void;
}

export default function MenteeSelector({ onSelect }: MenteeSelectorProps) {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    setMentees(loadMentees());
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newMentee: Mentee = {
      id: generateId(),
      name: name.trim(),
      company: company.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...mentees, newMentee];
    saveMentees(updated);
    setMentees(updated);
    setName('');
    setCompany('');
    setShowForm(false);
    onSelect(newMentee.id);
  };

  const handleDelete = (id: string) => {
    deleteMentee(id);
    setMentees(loadMentees());
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 mb-4">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Jornada Protagonista</h1>
          <p className="text-sm text-zinc-500 mt-1">Selecione um mentorado para continuar</p>
        </div>

        {mentees.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {mentees.map((m) => (
              <div
                key={m.id}
                className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 cursor-pointer hover:border-blue-500/50 hover:bg-zinc-900 transition-all"
                onClick={() => onSelect(m.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{m.name}</h3>
                    {m.company && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3 w-3 text-zinc-600" />
                        <span className="text-xs text-zinc-500 truncate">{m.company}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m.id);
                  }}
                  className="absolute top-3 right-3 text-zinc-700 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Novo Mentorado</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Nome *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do mentorado"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Empresa</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Empresa do mentorado"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowForm(false); setName(''); setCompany(''); }}
                  className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-5 text-sm text-zinc-400 hover:border-blue-500/50 hover:text-blue-400 transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Mentorado
          </button>
        )}
      </div>
    </div>
  );
}
