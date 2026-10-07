'use client';

import React, { useState } from 'react';
import { RecoveryProposal, RecoveryStrategy, RevisionItem } from '@/types/revision';
import { generateRecoveryProposal } from '@/lib/revision/recovery-planner';
import {
  Sparkles,
  Check,
  X
} from 'lucide-react';

interface RecoveryProposalCardProps {
  proposal: RecoveryProposal;
  overdueItems: RevisionItem[];
  onAccept: (acceptedProposal: RecoveryProposal) => void;
  onDismiss: (proposalId: string) => void;
}

export function RecoveryProposalCard({
  proposal: initialProposal,
  overdueItems,
  onAccept,
  onDismiss,
}: RecoveryProposalCardProps) {
  const [currentProposal, setCurrentProposal] = useState<RecoveryProposal>(initialProposal);
  const [activeStrategy, setActiveStrategy] = useState<RecoveryStrategy>(initialProposal.strategy);

  const handleStrategyChange = (newStrategy: RecoveryStrategy) => {
    setActiveStrategy(newStrategy);
    const updated = generateRecoveryProposal({
      overdueItems,
      preferredStrategy: newStrategy,
    });
    if (updated) {
      setCurrentProposal(updated);
    }
  };

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 via-[var(--surface-raised)] to-emerald-500/10 border border-amber-500/30 shadow-xs space-y-3.5 animate-slideUp">
      {/* Proposal Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                Backlog Detected ({currentProposal.backlogCount} topics)
              </span>
              <span className="text-[10px] text-[var(--foreground-muted)]">
                AI Adaptive Recovery
              </span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mt-1">
              {currentProposal.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Rationale explanation */}
      <p className="text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface)]/80 p-3 rounded-xl border border-[var(--border)]">
        {currentProposal.reason}
      </p>

      {/* Strategy Switcher Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wide block">
          Choose recovery approach:
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleStrategyChange('redistribute_spread')}
            className={`px-2 py-1.5 rounded-xl border font-medium transition-all text-center ${
              activeStrategy === 'redistribute_spread'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs font-bold'
                : 'bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-slate-300'
            }`}
          >
            <span className="block text-[11px]">Gentle Spread</span>
          </button>

          <button
            type="button"
            onClick={() => handleStrategyChange('buffer_catchup')}
            className={`px-2 py-1.5 rounded-xl border font-medium transition-all text-center ${
              activeStrategy === 'buffer_catchup'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs font-bold'
                : 'bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-slate-300'
            }`}
          >
            <span className="block text-[11px]">Weekend Buffer</span>
          </button>

          <button
            type="button"
            onClick={() => handleStrategyChange('prune_low_weight')}
            className={`px-2 py-1.5 rounded-xl border font-medium transition-all text-center ${
              activeStrategy === 'prune_low_weight'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs font-bold'
                : 'bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-slate-300'
            }`}
          >
            <span className="block text-[11px]">Core Priority</span>
          </button>
        </div>
      </div>

      {/* Proposed adjustments list */}
      <div className="space-y-1 bg-[var(--surface)]/60 p-2.5 rounded-xl border border-[var(--border)]">
        <span className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider block mb-1">
          Proposed Schedule Adjustments:
        </span>
        {currentProposal.proposedChanges.map((change, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]/50 last:border-0"
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
              <span className="text-[11px] text-[var(--foreground)] truncate">
                {change.description}
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[var(--primary)] shrink-0">
              {change.adjustedMinutes > 0 ? `+${change.adjustedMinutes}m` : 'Deferred'}
            </span>
          </div>
        ))}
      </div>

      {/* Decision Buttons (Human-in-the-Loop) */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => onDismiss(currentProposal.id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Dismiss</span>
        </button>

        <button
          type="button"
          onClick={() => onAccept(currentProposal)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-98"
        >
          <Check className="w-4 h-4" />
          <span>Accept Recovery Plan</span>
        </button>
      </div>
    </div>
  );
}
