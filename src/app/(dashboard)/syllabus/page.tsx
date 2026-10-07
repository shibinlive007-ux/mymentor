'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';
import {
  ALL_SYLLABUS_SUBJECTS,
  calculateSubjectRollups,
  computeSubtopicProgress,
  getDefaultSubtopicProgress
} from '@/lib/syllabus/seed-loader';
import { SubtopicUserProgress, SubtopicNode } from '@/types/syllabus';
import { SubtopicDetailSheet } from '@/components/syllabus/SubtopicDetailSheet';
import { calculateStageRollups } from '@/lib/completion';
import {
  Search,
  Zap,
  ArrowLeft
} from 'lucide-react';

function getInitialProgressMap(): Record<string, SubtopicUserProgress> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('upsc_syllabus_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
  }

  // Pre-seed mock progress for demonstration
  const map: Record<string, SubtopicUserProgress> = {};
  // 1857 Revolt completed
  map['p-hist-mod-1'] = {
    subtopicId: 'p-hist-mod-1',
    ncertRead: true,
    standardBookRead: true,
    standardBookName: 'Spectrum Ch 5-7',
    coachingAttended: true,
    extraSources: '',
    notesMade: true,
    currentAffairsLinked: true,
    pyqSolvedCount: 15,
    mcqPracticeDone: true,
    revisionCount: 2,
    lastRevisedAt: new Date().toISOString(),
    confidenceScore: 4,
    completionPercentage: 93.3,
  };
  // Fundamental Rights
  map['p-pol-2'] = {
    subtopicId: 'p-pol-2',
    ncertRead: true,
    standardBookRead: true,
    standardBookName: 'Laxmikanth Ch 7',
    coachingAttended: true,
    extraSources: '',
    notesMade: true,
    currentAffairsLinked: true,
    pyqSolvedCount: 25,
    mcqPracticeDone: true,
    revisionCount: 1,
    lastRevisedAt: new Date().toISOString(),
    confidenceScore: 5,
    completionPercentage: 86.7,
  };
  // Harappan Civilization
  map['p-hist-anc-1'] = {
    subtopicId: 'p-hist-anc-1',
    ncertRead: true,
    standardBookRead: false,
    standardBookName: '',
    coachingAttended: false,
    extraSources: '',
    notesMade: true,
    currentAffairsLinked: false,
    pyqSolvedCount: 5,
    mcqPracticeDone: true,
    revisionCount: 1,
    lastRevisedAt: null,
    confidenceScore: 3,
    completionPercentage: 51.7,
  };

  return map;
}

export default function SyllabusPage() {
  const { examMode, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeSubtopic, setActiveSubtopic] = useState<SubtopicNode | null>(null);
  const [quickUpdateMode, setQuickUpdateMode] = useState(false);

  // User progress state across subtopics
  const [progressMap, setProgressMap] = useState<Record<string, SubtopicUserProgress>>(getInitialProgressMap);

  // Filter subjects by active exam mode
  const currentStageSubjects = ALL_SYLLABUS_SUBJECTS.filter((s) => {
    if (examMode === 'prelims') return s.stage === 'prelims' || s.stage === 'csat';
    if (examMode === 'mains') return s.stage === 'mains';
    return true; // combined shows all
  });

  // Calculate live rollups from single source of truth
  const subjectRollups = calculateSubjectRollups(currentStageSubjects, progressMap);

  // Stage-aware completion percentage matching Progress tab exactly
  const stageStats = calculateStageRollups(ALL_SYLLABUS_SUBJECTS, progressMap, profile?.optional_subject);
  const overallPercentage =
    examMode === 'prelims'
      ? stageStats.prelims.percentage
      : examMode === 'mains'
      ? stageStats.mains.percentage
      : stageStats.overall.percentage;

  // Search filtering
  const filteredRollups = subjectRollups.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.paper.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSubject = ALL_SYLLABUS_SUBJECTS.find((s) => s.id === selectedSubjectId);
  const selectedRollup = subjectRollups.find((s) => s.subjectId === selectedSubjectId);

  const handleUpdateSubtopicProgress = (subtopicId: string, updates: Partial<SubtopicUserProgress>) => {
    setProgressMap((prev) => {
      const current = prev[subtopicId] || getDefaultSubtopicProgress(subtopicId);
      const computed = computeSubtopicProgress(current, updates);
      const nextMap = { ...prev, [subtopicId]: computed };
      localStorage.setItem('upsc_syllabus_progress', JSON.stringify(nextMap));
      return nextMap;
    });
  };

  // Quick 1-tap update action
  const handleQuickTap = (subtopicId: string) => {
    const cur = progressMap[subtopicId] || getDefaultSubtopicProgress(subtopicId);
    if (!cur.ncertRead) {
      handleUpdateSubtopicProgress(subtopicId, { ncertRead: true });
    } else if (!cur.standardBookRead) {
      handleUpdateSubtopicProgress(subtopicId, { standardBookRead: true });
    } else {
      // Increment revision
      const nextRev = Math.min(3, cur.revisionCount + 1);
      handleUpdateSubtopicProgress(subtopicId, {
        revisionCount: nextRev,
        lastRevisedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Header & Stage Summary */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface-hover)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--primary)]">
              {examMode} Syllabus Tracker
            </span>
            <div className="text-2xl font-extrabold text-[var(--foreground)] mt-0.5 font-mono">
              {overallPercentage}%
            </div>
            <p className="text-xs text-[var(--foreground-muted)]">
              {subjectRollups.length} subjects • Live weighted rollup
            </p>
          </div>

          <button
            type="button"
            onClick={() => setQuickUpdateMode(!quickUpdateMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              quickUpdateMode
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 shadow-xs'
                : 'bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-slate-300'
            }`}
            title="Toggle Quick Update Mode"
          >
            <Zap className={`w-3.5 h-3.5 ${quickUpdateMode ? 'fill-current' : ''}`} />
            <span>Quick Update</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 h-2 w-full bg-[var(--ring-track)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Update Notification Banner */}
      {quickUpdateMode && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between animate-fadeIn">
          <span>⚡ Quick Update Active: Tap any subtopic badge to mark NCERT/Book or add a revision!</span>
        </div>
      )}

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
        <input
          type="text"
          placeholder="Search syllabus by paper, subject or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
        />
      </div>

      {/* 3. Detail View: Subject Breakdown */}
      {selectedSubject && selectedRollup ? (
        <div className="space-y-3 animate-fadeIn">
          <button
            type="button"
            onClick={() => setSelectedSubjectId(null)}
            className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Subjects
          </button>

          {/* Subject Header Card */}
          <div className="rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
                  {selectedSubject.paper}
                </span>
                <h2 className="text-base font-bold text-[var(--foreground)] leading-tight mt-0.5">
                  {selectedSubject.subject}
                </h2>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {selectedRollup.completedStudyHours} / {selectedSubject.estimated_study_hours} hrs studied
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-[var(--primary)] font-mono">
                  {selectedRollup.completionPercentage}%
                </span>
                <p className="text-[10px] text-[var(--foreground-muted)]">Completed</p>
              </div>
            </div>
          </div>

          {/* Topics and Subtopics List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider px-1">
              Topics &amp; Micro-Checklists ({selectedSubject.topics.length})
            </h3>

            {selectedSubject.topics.map((topic, idx) => {
              const topicRollup = selectedRollup.topics[idx];

              return (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--foreground)]">{topic.title}</span>
                    <span className="text-[var(--primary)] font-mono font-bold">
                      {topicRollup?.completionPercentage || 0}%
                    </span>
                  </div>

                  {/* Topic Progress Bar */}
                  <div className="h-1.5 w-full bg-[var(--ring-track)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                      style={{ width: `${topicRollup?.completionPercentage || 0}%` }}
                    />
                  </div>

                  {/* Subtopics Checklist Items */}
                  <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                    {topic.subtopics.map((sub) => {
                      const p = progressMap[sub.id] || getDefaultSubtopicProgress(sub.id);
                      const isHighCoverage = p.completionPercentage >= 70;

                      return (
                        <div
                          key={sub.id}
                          className="p-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all flex items-center justify-between gap-2"
                        >
                          <div
                            onClick={() => setActiveSubtopic(sub)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-medium leading-snug truncate ${
                                  isHighCoverage ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                                }`}
                              >
                                {sub.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-[var(--foreground-muted)] mt-1">
                              <span>{p.ncertRead ? '📖 NCERT' : '—'}</span>
                              <span>•</span>
                              <span>{p.standardBookRead ? '📚 Book' : '—'}</span>
                              <span>•</span>
                              <span>{p.revisionCount > 0 ? `🔁 Rev ${p.revisionCount}x` : '—'}</span>
                            </div>
                          </div>

                          {/* Quick tap button or completion indicator */}
                          <div className="flex items-center gap-2">
                            {quickUpdateMode ? (
                              <button
                                type="button"
                                onClick={() => handleQuickTap(sub.id)}
                                className="px-2.5 py-1 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-[11px] font-semibold transition-colors flex items-center gap-1"
                              >
                                ⚡ +Progress
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveSubtopic(sub)}
                                className="text-xs font-mono font-bold text-[var(--primary)] bg-[var(--surface)] border border-[var(--border)] px-2 py-1 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                              >
                                {p.completionPercentage}%
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 4. Subject Cards List */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground-muted)]">
              {examMode === 'prelims' ? 'Prelims Subjects' : examMode === 'mains' ? 'Mains Subjects' : 'All Papers'}
            </h2>
            <span className="text-xs text-[var(--foreground-muted)]">
              {filteredRollups.length} subjects
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredRollups.map((subject) => (
              <div
                key={subject.subjectId}
                onClick={() => setSelectedSubjectId(subject.subjectId)}
                className="group cursor-pointer rounded-2xl p-4 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xs transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[var(--primary)] tracking-wide uppercase">
                    {subject.paper}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--foreground)] truncate mt-0.5 group-hover:text-[var(--primary)] transition-colors">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[var(--foreground-muted)] mt-1.5 font-mono">
                    <span>{subject.totalTopics} topics</span>
                    <span>•</span>
                    <span>{subject.totalSubtopics} checklist items</span>
                  </div>
                </div>

                {/* Animated Circular Completion Ring */}
                <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[var(--ring-track)]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[var(--primary)] transition-all duration-500 ease-out"
                      strokeDasharray={`${subject.completionPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-[var(--foreground)] font-mono">
                    {subject.completionPercentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtopic Detail Sheet Modal */}
      {activeSubtopic && (
        <SubtopicDetailSheet
          subtopic={activeSubtopic}
          progress={progressMap[activeSubtopic.id] || getDefaultSubtopicProgress(activeSubtopic.id)}
          onUpdate={(upd) => handleUpdateSubtopicProgress(activeSubtopic.id, upd)}
          onClose={() => setActiveSubtopic(null)}
        />
      )}
    </div>
  );
}
