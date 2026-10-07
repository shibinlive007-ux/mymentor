import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/supabase/auth-context';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'My Mentor | UPSC 2027 Adaptive Study System',
  description: 'Personal study planner, adaptive daily scheduler, revision manager, and grounded mentor for UPSC Civil Services 2027.',
  keywords: ['My Mentor', 'UPSC 2027', 'IAS Preparation', 'Study Planner', 'AI Mentor', 'Syllabus Tracker', 'Spaced Repetition'],
  authors: [{ name: 'My Mentor Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'My Mentor',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
