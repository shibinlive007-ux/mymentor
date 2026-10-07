/**
 * Data Privacy & Portability Manager
 * Compliant with India Digital Personal Data Protection (DPDP) Act 2023 & GDPR
 */

export interface ExportedPrepData {
  exportMetadata: {
    appName: string;
    targetExam: string;
    exportedAt: string;
    version: string;
  };
  profile: Record<string, unknown> | null;
  memories: unknown[];
  todayPlan: unknown | null;
  completedTasks: unknown[];
  studySessions: unknown[];
  syllabusProgress: Record<string, unknown>;
  revisionSchedule: unknown[];
  recentCheckins: unknown[];
}

/**
 * Gathers all active local storage data for complete portability
 */
export function compileUserDataForExport(userProfile?: Record<string, unknown> | null): ExportedPrepData {
  const getJson = (key: string, fallback: unknown) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    exportMetadata: {
      appName: 'My Mentor — UPSC CSE 2027',
      targetExam: 'UPSC Civil Services Examination 2027',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    profile: userProfile || null,
    memories: getJson('upsc_mentor_memories', []) as unknown[],
    todayPlan: getJson('upsc_today_plan', null),
    completedTasks: getJson('upsc_completed_tasks', []) as unknown[],
    studySessions: getJson('upsc_study_sessions', []) as unknown[],
    syllabusProgress: getJson('upsc_syllabus_progress', {}) as Record<string, unknown>,
    revisionSchedule: getJson('upsc_revision_items', []) as unknown[],
    recentCheckins: getJson('upsc_daily_checkins', []) as unknown[],
  };
}

/**
 * Triggers a browser download of the exported JSON archive
 */
export function triggerJsonDownload(data: ExportedPrepData, filename?: string): void {
  if (typeof window === 'undefined') return;

  const dateStr = new Date().toISOString().split('T')[0];
  const name = filename || `mymentor_upsc2027_archive_${dateStr}.json`;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Permanently wipes all aspirant preparation data from local storage
 * Supports India DPDP Act Right to Erasure / Data Purge
 */
export function purgeAllUserData(): void {
  if (typeof window === 'undefined') return;

  const storageKeys = [
    'upsc_mentor_memories',
    'upsc_today_plan',
    'upsc_completed_tasks',
    'upsc_study_sessions',
    'upsc_syllabus_progress',
    'upsc_revision_items',
    'upsc_daily_checkins',
    'upsc_today_checkin',
    'upsc_timer_mode',
    'upsc_timer_session',
    'upsc_active_task',
    'upsc_onboarding_answers',
  ];

  for (const key of storageKeys) {
    localStorage.removeItem(key);
  }
}
