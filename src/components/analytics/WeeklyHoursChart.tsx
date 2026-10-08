'use client';

import React, { useSyncExternalStore } from 'react';
import { Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export interface DayHourData {
  day: string;
  planned: number;
  actual: number;
}

interface WeeklyHoursChartProps {
  data: DayHourData[];
  targetAverage?: number;
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const actual = Number(payload.find((p) => p.dataKey === 'actual')?.value || 0);
    const planned = Number(payload.find((p) => p.dataKey === 'planned')?.value || 0);
    return (
      <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-lg text-xs space-y-1">
        <p className="font-bold text-[var(--foreground)]">{label}</p>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Actual: <strong>{actual.toFixed(1)} hrs</strong></span>
        </div>
        <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Planned: <strong>{planned.toFixed(1)} hrs</strong></span>
        </div>
      </div>
    );
  }
  return null;
}

const emptySubscribe = () => () => {};

export function WeeklyHoursChart({ data, targetAverage = 7.0 }: WeeklyHoursChartProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="h-52 w-full flex items-center justify-center bg-[var(--surface-raised)]/40 rounded-xl animate-pulse text-xs text-[var(--foreground-muted)]">
        Loading study volume chart...
      </div>
    );
  }

  const totalActual = data.reduce((sum, d) => sum + d.actual, 0);

  if (totalActual === 0) {
    return (
      <div className="h-52 w-full flex flex-col items-center justify-center bg-[var(--surface-raised)]/30 border border-dashed border-[var(--border)] rounded-2xl p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[var(--foreground)]">No Study Volume Logged This Week</p>
          <p className="text-[11px] text-[var(--foreground-muted)] max-w-xs">
            Start the timer or log a session in the Today tab to track your actual study hours against your daily target.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={4}
        >
          <XAxis
            dataKey="day"
            stroke="var(--foreground-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--foreground-muted)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}h`}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={targetAverage}
            stroke="#1e6b52"
            strokeDasharray="3 3"
            strokeOpacity={0.6}
            label={{
              value: `Target ${targetAverage}h`,
              position: 'right',
              fill: '#1e6b52',
              fontSize: 9,
            }}
          />
          <Bar
            dataKey="planned"
            fill="var(--border)"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          />
          <Bar
            dataKey="actual"
            radius={[4, 4, 0, 0]}
            maxBarSize={18}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.actual >= entry.planned ? '#1e6b52' : '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
