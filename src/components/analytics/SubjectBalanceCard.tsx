'use client';

import React from 'react';
import { SubjectBalanceMetric } from '@/types/analytics';
import { AlertTriangle, CheckCircle2, Scale } from 'lucide-react';

interface SubjectBalanceCardProps {
  metrics: SubjectBalanceMetric[];
}

export function SubjectBalanceCard({ metrics }: SubjectBalanceCardProps) {
  const overIndexedCount = metrics.filter((m) => m.status === 'over_indexed').length;
  const neglectedCount = metrics.filter((m) => m.status === 'neglected').length;

  return (
    <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[var(--foreground)]">
              Subject Balance &amp; 35% Cap Guardrail
            </h3>
            <p className="text-[10px] text-[var(--foreground-muted)]">
              Prevents over-indexing on favorites and protects balanced coverage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {overIndexedCount === 0 && neglectedCount === 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Balanced</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              <span>{overIndexedCount + neglectedCount} Attention</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2.5 pt-1">
        {metrics.map((item) => {
          const isOverIndexed = item.status === 'over_indexed';
          const isNeglected = item.status === 'neglected';

          return (
            <div key={item.subjectId} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[var(--foreground)]">
                    {item.subjectName}
                  </span>
                  {isOverIndexed && (
                    <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                      Exceeds 35% Cap
                    </span>
                  )}
                  {isNeglected && (
                    <span className="text-[9px] font-bold text-rose-700 dark:text-rose-300 bg-rose-500/15 px-1.5 py-0.2 rounded border border-rose-500/30">
                      0 hrs this week
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="font-bold text-[var(--foreground)]">
                    {item.actualHours.toFixed(1)}h
                  </span>
                  <span className="text-[var(--foreground-muted)]">
                    ({item.percentageOfTotal}%)
                  </span>
                </div>
              </div>

              {/* Bar with 35% marker */}
              <div className="relative h-2 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                {/* 35% Guide Marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10 opacity-70"
                  style={{ left: '35%' }}
                  title="35% Max Cap Threshold"
                />

                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverIndexed
                      ? 'bg-amber-500'
                      : isNeglected
                      ? 'bg-rose-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, item.percentageOfTotal)}%` }}
                />
              </div>

              {item.statusMessage && (isOverIndexed || isNeglected) && (
                <p className="text-[10px] text-[var(--foreground-muted)] italic pl-0.5">
                  {item.statusMessage}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded-xl bg-[var(--surface-raised)]/60 border border-[var(--border)] text-[10px] text-[var(--foreground-muted)] flex items-center justify-between">
        <span>Vertical line indicates the 35% weekly subject cap guardrail.</span>
        <span className="font-semibold text-[var(--primary)]">Target: 3-4 subjects/week</span>
      </div>
    </div>
  );
}
