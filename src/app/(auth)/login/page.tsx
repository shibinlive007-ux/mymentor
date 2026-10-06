'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { Sparkles, ArrowRight, Mail } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);

    const { error } = await signInWithEmail(email);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
    } else {
      router.push('/today');
    }
  };

  const handleQuickDemo = () => {
    router.push('/today');
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] mb-2 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            UPSC 2027 AI Mentor
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto">
            A calm, adaptive preparation system built for serious aspirants.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aspirant@upsc.test"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--surface)] px-2 text-[var(--foreground-muted)]">or quick access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors"
        >
          Explore As Aditya Sharma (Dev Mode)
        </button>

        <div className="mt-8 text-center text-xs text-[var(--foreground-muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--primary)] font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </MobileContainer>
  );
}
