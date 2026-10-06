'use client';

import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[var(--background)]">
      <div className={`w-full max-w-md md:max-w-lg min-h-screen flex flex-col bg-[var(--surface)] shadow-sm border-x border-[var(--border)] relative ${className}`}>
        {children}
      </div>
    </div>
  );
}
