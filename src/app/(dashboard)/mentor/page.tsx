'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
  proposal?: {
    id: string;
    title: string;
    reason: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
}

const initialMessages: ChatMsg[] = [
  {
    id: 'm-1',
    sender: 'mentor',
    text: "Namaste Aditya! I’ve reviewed your preparation state. You completed 90 mins of Modern History this morning, but you've skipped Physical Geography for two days. How are your energy levels right now?",
    timestamp: '10:15 AM',
  },
  {
    id: 'm-2',
    sender: 'user',
    text: "Feeling slightly fatigued due to work pressure. Can we lighten today's afternoon slot without hurting my revision schedule?",
    timestamp: '10:16 AM',
  },
  {
    id: 'm-3',
    sender: 'mentor',
    text: "Completely understood. UPSC 2027 is a marathon, not a sprint. I've drafted a lightweight recovery proposal that trims today's Geography task from 75 to 35 minutes (focusing only on core Climatology NCERT diagrams) and reschedules the deep PYQ practice to Saturday morning.",
    timestamp: '10:16 AM',
    proposal: {
      id: 'prop-1',
      title: 'Lighten Today’s Schedule (-40 mins)',
      reason: 'Prevent fatigue overload while maintaining NCERT momentum',
      status: 'pending',
    },
  },
];

export default function MentorPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const mentorReply: ChatMsg = {
        id: `m-${Date.now() + 1}`,
        sender: 'mentor',
        text: "I hear you. I'm taking this into account for your adaptive timetable. Remember: consistency over intensity. Would you like me to generate a focused 30-minute revision slot?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mentorReply]);
    }, 600);
  };

  const handleProposalAction = (msgId: string, action: 'accepted' | 'rejected') => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.proposal) {
          return {
            ...m,
            proposal: { ...m.proposal, status: action },
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] pb-4">
      {/* Grounded Mentor Context Header */}
      <div className="rounded-xl p-3 bg-[var(--surface-raised)] border border-[var(--border)] mb-3 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-[var(--foreground)]">Grounded AI Mentor</span>
            <span className="text-[var(--foreground-muted)] block text-[10px]">
              Grounded in your 2027 plan • Human-in-the-loop approval
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active</span>
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
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[var(--primary)] text-white rounded-br-xs'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-xs'
              }`}
            >
              {msg.text}

              {/* Proposal Card if attached */}
              {msg.proposal && (
                <div className="mt-3 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--primary)] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> AI Plan Proposal
                  </div>
                  <h4 className="font-semibold text-xs text-[var(--foreground)]">{msg.proposal.title}</h4>
                  <p className="text-[11px] text-[var(--foreground-muted)]">{msg.proposal.reason}</p>

                  <div className="pt-1 flex items-center gap-2">
                    {msg.proposal.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleProposalAction(msg.id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--primary)] text-white font-semibold text-[11px] hover:bg-[var(--primary-hover)] transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Accept Proposal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleProposalAction(msg.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--foreground-muted)] hover:text-red-600 text-[11px] transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
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
                        {msg.proposal.status === 'accepted' ? '✓ Changes Applied' : '✗ Proposal Rejected'}
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
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask for advice, re-plan your day, or discuss fatigue..."
          className="flex-1 px-3.5 py-2.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--primary)] transition-all shadow-xs"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
