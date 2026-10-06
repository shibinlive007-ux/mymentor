'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { ArrowRight, Mail, User } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function SignUpPage() {
  const router = useRouter();
  const { signInWithEmail } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await signInWithEmail(email);
    setLoading(false);
    router.push('/today');
  };

  return (
    <MobileContainer>
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center space-y-2 mb-8">
          <Image
            src="/logo.png"
            alt="My Mentor"
            width={56}
            height={56}
            className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-xs"
            priority
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            Join My Mentor
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto">
            Adaptive daily planner &amp; study system for UPSC CSE 2027.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aditya Sharma"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
              />
            </div>
          </div>

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
                placeholder="aditya@upsc.test"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[var(--surface-raised)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:bg-[var(--surface)] focus:border-[var(--primary)] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Creating Account...' : 'Start Free 7-Day Trial'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-[var(--foreground-muted)]">
          Already an aspirant?{' '}
          <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </MobileContainer>
  );
}
