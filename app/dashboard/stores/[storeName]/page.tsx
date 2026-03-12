import StoreDetailClient from './StoreDetailClient';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { getLiftData } from '@/lib/api';
import StoreInitializer from '@/components/StoreInitializer';
import { Metadata } from 'next';

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ storeName: string }> }): Promise<Metadata> {
  const { storeName } = await params;
  const decodedName = decodeURIComponent(storeName);
  return {
    title: `${decodedName} | OMG Interactive Dashboard`,
    description: `Real-time engagement metrics and kiosk health for ${decodedName} location.`,
  };
}

export default async function StorePage({ params }: { params: Promise<{ storeName: string }> }) {
  const { storeName } = await params;
  const decodedName = decodeURIComponent(storeName);
  const rawData = await getLiftData();
  const data = Array.isArray(rawData) ? rawData : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <StoreInitializer data={data} />
      {/* Sidebar - Reusing styles for consistency */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">OMG Data</span>
        </div>
        
        <nav className="space-y-1.5">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">System</div>
          <p className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 cursor-not-allowed">
            <Settings className="h-4 w-4" />
            Settings
          </p>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="p-8 max-w-7xl mx-auto">
          <StoreDetailClient storeName={decodedName} />
        </div>
      </main>
    </div>
  );
}
