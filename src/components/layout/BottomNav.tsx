'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, BookOpen, BarChart3, Sparkles, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'today', label: 'Today', href: '/today', icon: Calendar },
  { id: 'syllabus', label: 'Syllabus', href: '/syllabus', icon: BookOpen },
  { id: 'progress', label: 'Progress', href: '/progress', icon: BarChart3 },
  { id: 'mentor', label: 'Mentor', href: '/mentor', icon: Sparkles },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)]"
    >
      <div className="w-full max-w-md md:max-w-lg flex items-center justify-around py-1 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-150 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                isActive
                  ? 'text-[var(--primary)] font-semibold'
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  isActive ? 'bg-[var(--primary-light)] text-[var(--primary)]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-none tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
