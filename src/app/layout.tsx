import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/supabase/auth-context';

export const metadata: Metadata = {
  title: 'UPSC 2027 AI Mentor | Calm Adaptive Study System',
  description: 'Personal study planner, adaptive daily scheduler, revision manager, and grounded AI mentor for UPSC Civil Services 2027.',
  keywords: ['UPSC 2027', 'IAS Preparation', 'Study Planner', 'AI Mentor', 'Syllabus Tracker', 'Spaced Repetition'],
  authors: [{ name: 'UPSC AI Mentor Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e6b52',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#1e6b52]/20 antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
