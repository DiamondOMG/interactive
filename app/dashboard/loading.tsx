export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-200" />
        <div className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">
          Loading Dashboard Data...
        </div>
      </div>
    </div>
  );
}
