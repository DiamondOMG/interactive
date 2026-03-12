import React from 'react';

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
}: {
  title: string;
  value: string | React.ReactNode;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  color: "blue" | "indigo" | "cyan" | "sky";
}) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
    sky: "text-sky-600 bg-sky-50 border-sky-100",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5">
      <div className="flex items-start justify-between">
        <div
          className={`rounded-xl border p-2.5 transition-colors ${colors[color]}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            {trend}
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <div className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
          {description}
        </p>
      </div>
      <div className="absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-blue-50 opacity-0 blur-3xl transition-opacity group-hover:opacity-100"></div>
    </div>
  );
}
