import React from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileContainer>
      <TopHeader />
      <main className="flex-1 pb-20 px-4 pt-3 flex flex-col">
        {children}
      </main>
      <BottomNav />
    </MobileContainer>
  );
}
