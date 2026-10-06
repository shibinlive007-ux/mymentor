'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, PomodoroPhase, StudySession } from '@/types/session';
import { PlannerTask } from '@/types/planner';
import { saveStudySession } from '@/lib/sessions/session-manager';

interface UseStudyTimerProps {
  activeTask?: PlannerTask | null;
  onSessionLogged?: (session: StudySession) => void;
}

const TIMER_STORAGE_KEY = 'upsc_timer_state';

interface PersistedTimerState {
  mode: TimerMode;
  isRunning: boolean;
  startTimestamp: number | null;
  accumulatedSeconds: number;
  pomodoroDurationSeconds: number;
  pomodoroPhase: PomodoroPhase;
  taskId?: string;
}

function getInitialTimerState(): PersistedTimerState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
  }
  return {
    mode: 'stopwatch',
    isRunning: false,
    startTimestamp: null,
    accumulatedSeconds: 0,
    pomodoroDurationSeconds: 25 * 60,
    pomodoroPhase: 'focus',
  };
}

export function useStudyTimer({ activeTask, onSessionLogged }: UseStudyTimerProps = {}) {
  const [initial] = useState<PersistedTimerState>(getInitialTimerState);
  const [mode, setMode] = useState<TimerMode>(initial.mode);
  const [isRunning, setIsRunning] = useState<boolean>(initial.isRunning);
  const [pomodoroDuration, setPomodoroDuration] = useState<number>(initial.pomodoroDurationSeconds);
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>(initial.pomodoroPhase);
  const [seconds, setSeconds] = useState<number>(() => {
    if (initial.isRunning && initial.startTimestamp) {
      const elapsed = Math.floor((Date.now() - initial.startTimestamp) / 1000);
      return initial.accumulatedSeconds + elapsed;
    }
    return initial.accumulatedSeconds;
  });
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  const accumulatedSecondsRef = useRef<number>(initial.accumulatedSeconds);
  const startTimestampRef = useRef<number | null>(initial.startTimestamp);

  // Persist state to localStorage whenever running status or mode changes
  const persistState = useCallback(() => {
    if (typeof window === 'undefined') return;
    const stateToSave: PersistedTimerState = {
      mode,
      isRunning,
      startTimestamp: startTimestampRef.current,
      accumulatedSeconds: accumulatedSecondsRef.current,
      pomodoroDurationSeconds: pomodoroDuration,
      pomodoroPhase,
      taskId: activeTask?.id,
    };
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [mode, isRunning, pomodoroDuration, pomodoroPhase, activeTask?.id]);

  // Tick calculation effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (startTimestampRef.current) {
          const elapsedSinceStart = Math.floor((Date.now() - startTimestampRef.current) / 1000);
          const total = accumulatedSecondsRef.current + elapsedSinceStart;
          setSeconds(total);

          // Handle Pomodoro completion
          if (mode === 'pomodoro' && total >= pomodoroDuration) {
            setIsRunning(false);
            startTimestampRef.current = null;
            accumulatedSecondsRef.current = pomodoroDuration;
            setSeconds(pomodoroDuration);
            // In a real browser, play audio chime or trigger vibration
            if (typeof window !== 'undefined' && 'Notification' in window) {
              try {
                if (Notification.permission === 'granted') {
                  new Notification('Pomodoro Completed! Time for a short break.');
                }
              } catch {
                // notification fallback
              }
            }
          }
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, pomodoroDuration]);

  // Start timer
  const startTimer = useCallback(() => {
    const now = Date.now();
    startTimestampRef.current = now;
    if (!sessionStartTime) {
      setSessionStartTime(new Date(now).toISOString());
    }
    setIsRunning(true);
  }, [sessionStartTime]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (startTimestampRef.current) {
      const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1000);
      accumulatedSecondsRef.current += elapsed;
      startTimestampRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    startTimestampRef.current = null;
    accumulatedSecondsRef.current = 0;
    setSeconds(0);
    setSessionStartTime(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TIMER_STORAGE_KEY);
    }
  }, []);

  // Switch between Stopwatch and Pomodoro
  const switchMode = useCallback((newMode: TimerMode) => {
    pauseTimer();
    setMode(newMode);
    accumulatedSecondsRef.current = 0;
    setSeconds(0);
  }, [pauseTimer]);

  // Set Pomodoro preset duration
  const setPomodoroPreset = useCallback((focusMinutes: number) => {
    pauseTimer();
    setPomodoroDuration(focusMinutes * 60);
    accumulatedSecondsRef.current = 0;
    setSeconds(0);
    setPomodoroPhase('focus');
  }, [pauseTimer]);

  // Log session manually or on completion
  const logSession = useCallback(
    (notes?: string): StudySession | null => {
      const currentSeconds = seconds;
      const durationMinutes = Math.max(1, Math.round(currentSeconds / 60));

      if (durationMinutes <= 0 && currentSeconds < 30) {
        return null;
      }

      const session: StudySession = {
        id: `sess-${Date.now()}`,
        taskId: activeTask?.id,
        subjectId: activeTask?.subjectId || 'general-study',
        subjectName: activeTask?.subjectName || 'Self Study',
        topicId: activeTask?.topicId || 'general-topic',
        topicTitle: activeTask?.topicTitle || 'General Preparation',
        startedAt: sessionStartTime || new Date(Date.now() - currentSeconds * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationMinutes,
        sessionType: activeTask?.taskType || 'new_study',
        notes,
      };

      saveStudySession(session);
      resetTimer();

      if (onSessionLogged) {
        onSessionLogged(session);
      }

      return session;
    },
    [seconds, activeTask, sessionStartTime, resetTimer, onSessionLogged]
  );

  // Sync to localStorage on status updates
  useEffect(() => {
    persistState();
  }, [persistState]);

  // Display seconds for Pomodoro (countdown) vs Stopwatch (count-up)
  const displaySeconds =
    mode === 'pomodoro' ? Math.max(0, pomodoroDuration - seconds) : seconds;

  const pomodoroProgressPercent =
    mode === 'pomodoro'
      ? Math.min(100, Math.round((seconds / pomodoroDuration) * 100))
      : 0;

  return {
    mode,
    isRunning,
    seconds: displaySeconds,
    rawElapsedSeconds: seconds,
    pomodoroDuration,
    pomodoroPhase,
    pomodoroProgressPercent,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setPomodoroPreset,
    logSession,
  };
}
