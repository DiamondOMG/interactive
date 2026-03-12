import AnalyticsClient from './AnalyticsClient';
import Link from 'next/link';
import { LayoutDashboard, BarChart3, Settings, ShieldCheck, ChevronLeft } from 'lucide-react';
import { LiftData } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Insights | OMG Interactive',
  description: 'Deep dive into content performance and store engagement across the network.',
};

// ISR configuration: Revalidate every 10 minutes (matching user preference)
export const revalidate = 600;

async function getLiftData(): Promise<LiftData[]> {
  const url = 'https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall';
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data from API');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default async function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white p-6 lg:block shadow-sm">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">OMG Data</span>
        </div>
        
        <nav className="space-y-1.5">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-100"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">System</div>
          <Link 
            href="#" 
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-4">
               <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors lg:hidden">
                 <ChevronLeft className="h-5 w-5" />
               </Link>
               <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Analytics Dashboard</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Presentation Mode</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
                Generate Report
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Main Visual Component */}
          <AnalyticsClient />
        </div>
      </main>
    </div>
  );
}
