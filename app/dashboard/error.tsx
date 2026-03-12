'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-6 text-red-500 shadow-lg shadow-red-100/50">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Something went wrong!</h2>
      <p className="mt-2 max-w-md text-slate-500 font-medium">
        We encountered an error while trying to load the dashboard data. This might be a temporary connection issue.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
