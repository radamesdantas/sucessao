'use client';

interface ProgressCardProps {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  color?: string;
}

export default function ProgressCard({ label, value, max = 100, suffix = '%', color = 'blue' }: ProgressCardProps) {
  const pct = Math.min((value / max) * 100, 100);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
  };
  const barColor = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}{suffix}
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
