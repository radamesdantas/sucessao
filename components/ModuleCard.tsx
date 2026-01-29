'use client';

import Link from 'next/link';
import { Check, Clock, Circle } from 'lucide-react';
import { Module, PHASE_COLORS } from '@/lib/types';

interface ModuleCardProps {
  module: Module;
  basePath?: string;
}

export default function ModuleCard({ module, basePath = '/modulos' }: ModuleCardProps) {
  const completedWeeks = module.weeks.filter((w) => w.status === 'completed').length;
  const StatusIcon = module.status === 'completed' ? Check : module.status === 'in_progress' ? Clock : Circle;

  return (
    <Link href={`${basePath}/${module.id}`}>
      <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ backgroundColor: PHASE_COLORS[module.phase] }}
            >
              {module.id}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {module.name}
              </h3>
              <p className="text-[11px] text-zinc-500">Fase {module.phase}</p>
            </div>
          </div>
          <StatusIcon className={`h-4 w-4 ${
            module.status === 'completed' ? 'text-emerald-400' :
            module.status === 'in_progress' ? 'text-amber-400' : 'text-zinc-600'
          }`} />
        </div>
        <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{module.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {module.weeks.map((w) => (
              <div
                key={w.week}
                className={`h-1.5 w-6 rounded-full ${
                  w.status === 'completed' ? 'bg-emerald-500' :
                  w.status === 'in_progress' ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-500">{completedWeeks}/4 semanas</span>
        </div>
      </div>
    </Link>
  );
}
