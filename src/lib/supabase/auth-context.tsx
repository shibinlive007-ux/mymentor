'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ExamMode } from '@/types/database.types';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  target_year: number;
  attempt_number: number;
  exam_mode: ExamMode;
  optional_subject?: string | null;
  daily_target_hours_min: number;
  daily_target_hours_max: number;
  streak_count: number;
  is_onboarded: boolean;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultDevProfile: UserProfile = {
  id: 'usr_dev_aspirant_2027',
  email: 'aspirant2027@upsc.test',
  full_name: 'Aditya Sharma',
  target_year: 2027,
  attempt_number: 1,
  exam_mode: 'combined',
  optional_subject: 'PSIR (Political Science & IR)',
  daily_target_hours_min: 7.0,
  daily_target_hours_max: 8.5,
  streak_count: 14,
  is_onboarded: true,
};

function getInitialProfile(): UserProfile {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('upsc_dev_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultDevProfile;
      }
    }
  }
  return defaultDevProfile;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(getInitialProfile);
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    const initial = getInitialProfile();
    return { id: initial.id, email: initial.email };
  });
  const [examMode, setExamModeState] = useState<ExamMode>(() => {
    const initial = getInitialProfile();
    return initial.exam_mode || 'combined';
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isMock = !supabaseUrl || supabaseUrl.includes('placeholder');

    if (isMock) {
      return;
    }

    const supabase = createClient();

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfile) {
            const mapped = userProfile as unknown as UserProfile;
            setProfile(mapped);
            setExamModeState(mapped.exam_mode || 'combined');
          }
        }
      } catch (err) {
        console.warn('Auth init failed, using dev mode:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const setExamMode = (mode: ExamMode) => {
    setExamModeState(mode);
    if (profile) {
      const updated = { ...profile, exam_mode: mode };
      setProfile(updated);
      localStorage.setItem('upsc_dev_profile', JSON.stringify(updated));
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      localStorage.setItem('upsc_dev_profile', JSON.stringify(updated));
    }
  };

  const signInWithEmail = async (email: string): Promise<{ error: string | null }> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const newProf = { ...defaultDevProfile, email, full_name: email.split('@')[0] };
      setUser({ id: newProf.id, email });
      setProfile(newProf);
      localStorage.setItem('upsc_dev_profile', JSON.stringify(newProf));
      return { error: null };
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('upsc_dev_profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        examMode,
        setExamMode,
        isLoading,
        signInWithEmail,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
