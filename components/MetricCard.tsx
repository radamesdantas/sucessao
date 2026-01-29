'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
}

export default function MetricCard({ icon: Icon, label, value, sublabel, color = 'blue' }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  };
  const iconColor = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 flex items-start gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
        {sublabel && <p className="text-[11px] text-zinc-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}
