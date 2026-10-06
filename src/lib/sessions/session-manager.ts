/**
 * Study Session Logging & Aggregation Manager
 */

import { StudySession } from '@/types/session';

const STORAGE_KEY = 'upsc_study_sessions';

export function getAllSessions(): StudySession[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStudySession(session: StudySession): StudySession[] {
  const current = getAllSessions();
  const updated = [session, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getTodaySessions(dateStr?: string): StudySession[] {
  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  const all = getAllSessions();
  return all.filter((s) => s.startedAt.startsWith(targetDate) || s.endedAt.startsWith(targetDate));
}

export function calculateTotalStudyMinutes(sessions: StudySession[]): number {
  return sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function aggregateMinutesBySubject(sessions: StudySession[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of sessions) {
    map[s.subjectName] = (map[s.subjectName] || 0) + s.durationMinutes;
  }
  return map;
}

export function aggregateMinutesByType(sessions: StudySession[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const s of sessions) {
    map[s.sessionType] = (map[s.sessionType] || 0) + s.durationMinutes;
  }
  return map;
}
