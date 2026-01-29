'use client';

import { useState } from 'react';
import { useAppData } from '@/hooks/useLocalStorage';
import { addCheckIn } from '@/lib/storage';
import CheckInModal from '@/components/CheckInModal';
import { CheckIn } from '@/lib/types';
import { formatDate, getCheckInStreak } from '@/lib/utils';
import { MessageSquare, Sun, CloudSun, Moon, Flame, Calendar } from 'lucide-react';

export default function CheckInsPage() {
  const { data, refreshData, menteeId } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7h' | '13h' | '20h'>('7h');

  if (!data) {
    return <div className="flex items-center justify-center h-96"><div className="animate-pulse text-zinc-500">Carregando...</div></div>;
  }

  const streak = getCheckInStreak(data);
  const today = new Date().toISOString().split('T')[0];
  const todayCheckIns = data.checkIns.filter((c) => c.date === today);
  const hasMorning = todayCheckIns.some((c) => c.period === '7h');
  const hasAfternoon = todayCheckIns.some((c) => c.period === '13h');
  const hasNight = todayCheckIns.some((c) => c.period === '20h');

  const handleOpenCheckIn = (period: '7h' | '13h' | '20h') => {
    setSelectedPeriod(period);
    setModalOpen(true);
  };

  const handleSaveCheckIn = (checkIn: CheckIn) => {
    if (!menteeId) return;
    addCheckIn(menteeId, checkIn);
    refreshData();
  };

  const groupedByDate = data.checkIns.reduce<Record<string, CheckIn[]>>((acc, ci) => {
    if (!acc[ci.date]) acc[ci.date] = [];
    acc[ci.date].push(ci);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  const periodConfig = [
    { period: '7h' as const, label: 'Manha', icon: Sun, done: hasMorning, color: 'amber' },
    { period: '13h' as const, label: 'Tarde', icon: CloudSun, done: hasAfternoon, color: 'blue' },
    { period: '20h' as const, label: 'Noite', icon: Moon, done: hasNight, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Check-ins</h1>
        <p className="text-sm text-zinc-500 mt-1">Clone Digital - Reflexoes diarias de gestao</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Streak Atual</p>
            <p className="text-xl font-bold text-white">{streak} dias</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Total de Check-ins</p>
            <p className="text-xl font-bold text-white">{data.checkIns.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-zinc-500">Hoje</p>
            <p className="text-xl font-bold text-white">{todayCheckIns.length}/3</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Check-ins de Hoje</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periodConfig.map(({ period, label, icon: Icon, done, color }) => (
            <button
              key={period}
              onClick={() => !done && handleOpenCheckIn(period)}
              disabled={done}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                done
                  ? 'border-emerald-500/30 bg-emerald-500/10 cursor-default'
                  : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-750 cursor-pointer'
              }`}
            >
              <Icon className={`h-5 w-5 ${done ? 'text-emerald-400' : `text-${color}-400`}`} />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{label} ({period})</p>
                <p className="text-[11px] text-zinc-500">{done ? 'Concluido' : 'Pendente'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Historico</h2>
        {sortedDates.length === 0 ? (
          <p className="text-xs text-zinc-500">Nenhum check-in registrado ainda.</p>
        ) : (
          <div className="space-y-4">
            {sortedDates.slice(0, 14).map((date) => (
              <div key={date} className="border-b border-zinc-800 pb-4 last:border-0">
                <p className="text-xs font-semibold text-zinc-300 mb-2">{formatDate(date)}</p>
                <div className="space-y-3">
                  {groupedByDate[date].map((ci) => (
                    <div key={ci.id} className="ml-4">
                      <p className="text-[11px] text-zinc-500 mb-1">{ci.period}</p>
                      {ci.responses.map((r, i) => (
                        <div key={i} className="mb-1">
                          <p className="text-[10px] text-zinc-600">{r.question}</p>
                          <p className="text-xs text-zinc-300">{r.answer}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CheckInModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCheckIn}
        period={selectedPeriod}
      />
    </div>
  );
}
