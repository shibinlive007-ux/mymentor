'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  Sparkles,
  Send,
  CheckCircle,
  XCircle,
  ShieldCheck,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import {
  generateGroundedMentorReply,
  getContextualChips,
} from '@/lib/mentor/mentor-engine';
import { MentorMessage, MentorUserContext } from '@/types/mentor';
import { getRevisionHealthSummary } from '@/lib/revision/revision-engine';
import { DailyPlan, PlannerTask } from '@/types/planner';

const INITIAL_GREETING: MentorMessage = {
  id: 'm-initial',
  sender: 'mentor',
  text: "Namaste! I am My Mentor, grounded in the official UPSC CSE 2027 syllabus and your personal preparation progress.\n\nWhether you need Mains answer frameworks, high-yield Prelims PYQ priorities, Ethics case study blueprints, or calm fatigue recovery—ask freely. What is on your mind today?",
  timestamp: 'Just now',
  citations: [
    { label: 'UPSC CSE 2027 Grounded Knowledge Base', paper: 'Curriculum & Strategy' },
  ],
};

function createUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getFormattedTimeString(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MentorPage() {
  const { profile, examMode } = useAuth();
  const [messages, setMessages] = useState<MentorMessage[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isReplying]);

  // Construct current user context
  const getUserContext = (): MentorUserContext => {
    let overdueCount = 0;
    let retentionPercent = 100;
    let overIndexedSubject: string | undefined;
    let neglectedSubject: string | undefined;

    if (typeof window !== 'undefined') {
      const isDemo = localStorage.getItem('upsc_demo_mode') === 'true';
      const savedProg = localStorage.getItem('upsc_syllabus_progress');
      if (savedProg) {
        try {
          const parsed = JSON.parse(savedProg);
          const health = getRevisionHealthSummary({ progressMap: parsed, examMode });
          overdueCount = health.overdueCount;
          retentionPercent = health.retentionFreshnessPercent;
        } catch {
          // fallback
        }
      } else if (isDemo) {
        overdueCount = 2;
        retentionPercent = 85;
      }

      if (isDemo) {
        overIndexedSubject = 'Modern History';
        neglectedSubject = 'Ethics (GS IV)';
      }
    }

    return {
      fullName: profile?.full_name || 'Aspirant',
      examMode: examMode || 'combined',
      streakDays: profile?.streak_count || 0,
      overdueCount,
      retentionPercent,
      overIndexedSubject,
      neglectedSubject,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: MentorMessage = {
      id: createUniqueId('m-usr'),
      sender: 'user',
      text: query,
      timestamp: getFormattedTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsReplying(true);

    setTimeout(() => {
      const context = getUserContext();
      const reply = generateGroundedMentorReply(query, context);
      setMessages((prev) => [...prev, reply]);
      setIsReplying(false);
    }, 400);
  };

  const handleProposalAction = (msgId: string, action: 'accepted' | 'rejected') => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.proposal) {
          // If accepted, update today's plan in localStorage
          if (action === 'accepted' && typeof window !== 'undefined') {
            const savedPlan = localStorage.getItem('upsc_today_plan');
            if (savedPlan) {
              try {
                const plan: DailyPlan = JSON.parse(savedPlan);
                if (m.proposal.actionType === 'minimum_viable_day') {
                  plan.isMinimumViableDay = true;
                  plan.mentorRationale = 'Minimum Viable Day activated to recover cognitive bandwidth without guilt.';
                  localStorage.setItem('upsc_today_plan', JSON.stringify(plan));
                } else if (m.proposal.actionType === 'add_ethics_slot') {
                  const newTask: PlannerTask = {
                    id: createUniqueId('task-eth'),
                    subjectId: 'm-eth',
                    subjectName: 'Ethics (GS IV)',
                    topicId: 'case-studies',
                    topicTitle: 'GS IV Case Study 5-Step Practice',
                    taskType: 'answer_writing',
                    durationMinutes: 45,
                    completedMinutes: 0,
                    status: 'pending',
                    reason: 'Scheduled via My Mentor Case Study Blueprint recommendation',
                    orderIndex: plan.tasks.length + 1,
                  };
                  plan.tasks.push(newTask);
                  plan.totalPlannedMinutes += 45;
                  localStorage.setItem('upsc_today_plan', JSON.stringify(plan));
                }
              } catch {
                // fallback
              }
            }
          }

          return {
            ...m,
            proposal: { ...m.proposal, status: action },
          };
        }
        return m;
      })
    );
  };

  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-3">
      {/* Grounded Mentor Context Header */}
      <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[var(--surface-raised)] to-[var(--surface)] border border-[var(--border)] mb-2.5 text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="My Mentor"
            width={28}
            height={28}
            className="w-7 h-7 object-contain rounded-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--foreground)] text-sm">My Mentor</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                100% Free • Zero-API
              </span>
            </div>
            <span className="text-[var(--foreground-muted)] block text-[10px] mt-0.5">
              Grounded in official 2027 syllabus &amp; your live study rhythm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Syllabus Guardrails Active</span>
          </div>
          <button
            type="button"
            onClick={handleClearChat}
            className="p-1 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>



      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-white rounded-br-xs'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Citations / Source Badges */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[var(--border)]/60 flex items-center gap-1.5 flex-wrap">
                  {msg.citations.map((cite, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--primary)] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                    >
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>{cite.label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Proposal Card if attached */}
              {msg.proposal && (
                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Adaptive Plan Proposal
                  </div>
                  <h4 className="font-semibold text-xs text-[var(--foreground)]">
                    {msg.proposal.title}
                  </h4>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    {msg.proposal.reason}
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    {msg.proposal.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProposalAction(msg.id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--primary)] text-white font-semibold text-[11px] hover:bg-[var(--primary-hover)] transition-colors shadow-xs active:scale-98"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept Proposal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProposalAction(msg.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-rose-600 text-[11px] transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          msg.proposal.status === 'accepted'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {msg.proposal.status === 'accepted'
                          ? '✓ Changes Applied to Schedule'
                          : '✗ Proposal Dismissed'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-[var(--foreground-muted)] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isReplying && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span>My Mentor is structuring guidance...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2-3 Contextual Guidance Chips */}
      <div className="pt-2 pb-1.5 flex items-center gap-1.5 flex-wrap">
        {getContextualChips(getUserContext()).map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => handleSendMessage(chip.query)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[var(--foreground)] border border-[var(--border)] transition-all hover:border-[var(--primary)]/50 active:scale-98 shadow-xs"
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Clean Single Prompt Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask for advice, re-plan your day, or explore PYQ trends..."
          className="flex-1 px-4 py-3 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--primary)] transition-all shadow-xs outline-none"
          aria-label="Ask My Mentor"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition-colors flex-shrink-0 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
