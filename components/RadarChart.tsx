'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CCE_NAMES } from '@/lib/types';
import { getCCEShortName } from '@/lib/utils';

interface RadarChartProps {
  scores: Record<string, number>;
  previousScores?: Record<string, number> | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function RadarChartComponent({ scores, previousScores, size = 'md' }: RadarChartProps) {
  const data = CCE_NAMES.map((name) => ({
    subject: getCCEShortName(name),
    fullName: name,
    current: scores[name] || 0,
    ...(previousScores ? { previous: previousScores[name] || 0 } : {}),
  }));

  const heights: Record<string, number> = { sm: 250, md: 350, lg: 450 };
  const h = heights[size] || heights.md;

  return (
    <ResponsiveContainer width="100%" height={h}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius={size === 'sm' ? '65%' : '75%'}>
        <PolarGrid stroke="#27272a" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#a1a1aa', fontSize: size === 'sm' ? 9 : 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: '#52525b', fontSize: 9 }}
          tickCount={6}
        />
        {previousScores && (
          <Radar
            name="Anterior"
            dataKey="previous"
            stroke="#6b7280"
            fill="#6b7280"
            fillOpacity={0.1}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}
        <Radar
          name="Atual"
          dataKey="current"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#e4e4e7' }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
