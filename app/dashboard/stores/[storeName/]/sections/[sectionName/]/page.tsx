import React from 'react';
import SectionDetailClient from './SectionDetailClient';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, BarChart3, Settings } from 'lucide-react';

interface LiftData {
  Total: string;
  libraryItemLabel: string;
  screenLabel: string;
  storeLocation: string;
  storeSection: string;
  libraryItemId: string;
  itemId: string;
  screenId: string;
}

export const revalidate = 600;

async function getLiftData(): Promise<LiftData[]> {
  const url = 'https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall';
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function SectionPage({ 
  params 
}: { 
  params: Promise<{ storeName: string; sectionName: string }> 
}) {
  const { storeName, sectionName } = await params;
  const decodedStore = decodeURIComponent(storeName);
  const decodedSection = decodeURIComponent(sectionName);
  
  const rawData = await getLiftData();
  const data = Array.isArray(rawData) ? rawData : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">OMG Data</span>
        </div>
        
        <nav className="space-y-1.5">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="p-8 max-w-7xl mx-auto">
          <SectionDetailClient 
            storeName={decodedStore} 
            sectionName={decodedSection} 
            data={data} 
          />
        </div>
      </main>
    </div>
  );
}
