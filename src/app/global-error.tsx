'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function RootGlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-3xl bg-[#1e293b] border border-slate-700/60 p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">System Calibration</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              An unexpected layout state was encountered. Please reload to resume your UPSC 2027 preparation session.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reconnect
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
