'use client';

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { ArrowLeft, Box, Monitor, Package, Info, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

import { useStore } from '@/lib/store';

export default function SectionDetailClient({ 
  storeName, 
  sectionName,
}: { 
  storeName: string; 
  sectionName: string;
}) {
  const { liftData: data } = useStore();
  const sectionData = useMemo(() => {
    return data.filter(item => 
      item["screen.storeLocation"] === storeName && 
      (item["screen.storeSection"] === sectionName || (sectionName === 'Main Area' && !item["screen.storeSection"]))
    );
  }, [data, storeName, sectionName]);

  const stats = useMemo(() => {
    const totalLifts = sectionData.reduce((acc, curr) => acc + parseInt(curr.Total || '0'), 0);
    const uniqueScreens = new Set(sectionData.map(item => item.screenId)).size;
    
    // Aggregation for items in this section
    const contentMap = new Map<string, number>();
    sectionData.forEach(item => {
      const label = item["libraryItem.label"] || "Unknown";
      const current = contentMap.get(label) || 0;
      contentMap.set(label, current + parseInt(item.Total || '0'));
    });
    
    const chartData = Array.from(contentMap.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return { totalLifts, uniqueScreens, chartData };
  }, [sectionData]);

  if (sectionData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Info className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Section Not Found</h2>
        <p className="text-slate-500 mt-2">No data found for "{sectionName}" in {storeName}</p>
        <Link href={`/dashboard/stores/${encodeURIComponent(storeName)}`} className="mt-6 text-blue-600 font-bold hover:underline">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Link href={`/dashboard/stores/${encodeURIComponent(storeName)}`} className="text-sm font-bold text-blue-600 flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to {storeName}
          </Link>
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-100">
                <Box className="h-6 w-6 text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{sectionName}</h1>
                <p className="text-slate-500 text-sm">Targeted Analytics for specific store zone</p>
             </div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-4">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Section Status</span>
              <span className="text-sm font-bold text-green-600">Active Monitoring</span>
           </div>
           <Activity className="h-5 w-5 text-green-500 animate-pulse" />
        </div>
      </div>

      {/* Specific Section Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Zone Interactions</p>
              <h4 className="text-5xl font-black text-slate-800 mt-2">{stats.totalLifts.toLocaleString()}</h4>
           </div>
           <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-blue-600" />
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Kiosks in Zone</p>
              <h4 className="text-5xl font-black text-slate-800 mt-2">{stats.uniqueScreens}</h4>
           </div>
           <div className="h-16 w-16 bg-cyan-50 rounded-full flex items-center justify-center">
              <Monitor className="h-8 w-8 text-cyan-600" />
           </div>
        </div>
      </div>

      {/* Content Analysis */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-8">
          <Package className="h-5 w-5 text-cyan-600" />
          Content Engagement in {sectionName}
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="total" fill="#0891b2" radius={[10, 10, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
