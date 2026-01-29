'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/useLocalStorage';
import { addContact, updateContact, deleteContact } from '@/lib/storage';
import { Contact } from '@/lib/types';
import { generateId, formatDate } from '@/lib/utils';
import { Users, Plus, Search, Pencil, Trash2, X, Save } from 'lucide-react';

const CATEGORIES = ['Mentor', 'Parceiro', 'Cliente', 'Fornecedor', 'Colega', 'Outro'];

export default function NetworkPage() {
  const { data, refreshData, menteeId } = useAppData();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', insights: '', lastContact: '', category: 'Outro' });

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const filtered = data.contacts.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleSave = () => {
    if (!form.name.trim() || !menteeId) return;
    if (editingId) {
      updateContact(menteeId, editingId, { ...form });
    } else {
      addContact(menteeId, { id: generateId(), ...form });
    }
    refreshData();
    resetForm();
  };

  const handleEdit = (contact: Contact) => {
    setForm({ name: contact.name, role: contact.role, company: contact.company, insights: contact.insights, lastContact: contact.lastContact, category: contact.category });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!menteeId) return;
    deleteContact(menteeId, id);
    refreshData();
  };

  const resetForm = () => {
    setForm({ name: '', role: '', company: '', insights: '', lastContact: '', category: 'Outro' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Network</h1>
          <p className="text-sm text-zinc-500 mt-1">CRM de contatos estrategicos</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Contato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Total de Contatos</p>
            <p className="text-xl font-bold text-white">{data.contacts.length}</p>
          </div>
        </div>
        <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-500 mb-2">Progresso ate 100 contatos</p>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${Math.min(data.contacts.length, 100)}%` }} />
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">{data.contacts.length}/100</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">{editingId ? 'Editar Contato' : 'Novo Contato'}</h2>
            <button onClick={resetForm} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Cargo" className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" />
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Empresa" className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
            <textarea value={form.insights} onChange={(e) => setForm({ ...form, insights: e.target.value })} placeholder="Insights / Notas" rows={2} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none resize-none md:col-span-2" />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={resetForm} className="px-4 py-2 text-sm rounded-lg text-zinc-400 hover:bg-zinc-800 transition-colors">Cancelar</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Save className="h-3.5 w-3.5" />
              Salvar
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contatos..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-10 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Todas categorias</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            {data.contacts.length === 0 ? 'Nenhum contato cadastrado.' : 'Nenhum resultado encontrado.'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-[11px] font-medium text-zinc-500 px-4 py-3">Nome</th>
                <th className="text-left text-[11px] font-medium text-zinc-500 px-4 py-3">Cargo</th>
                <th className="text-left text-[11px] font-medium text-zinc-500 px-4 py-3">Empresa</th>
                <th className="text-left text-[11px] font-medium text-zinc-500 px-4 py-3">Categoria</th>
                <th className="text-left text-[11px] font-medium text-zinc-500 px-4 py-3">Ultimo Contato</th>
                <th className="text-right text-[11px] font-medium text-zinc-500 px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                <tr key={contact.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm text-white font-medium">{contact.name}</p>
                    {contact.insights && <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-[200px]">{contact.insights}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{contact.role}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{contact.company}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">{contact.category}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{contact.lastContact ? formatDate(contact.lastContact) : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(contact)} className="text-zinc-500 hover:text-blue-400 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="text-zinc-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
