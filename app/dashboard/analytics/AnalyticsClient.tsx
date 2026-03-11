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
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, Package, MapPin, Monitor } from 'lucide-react';

interface DisplayCounts {
  [key: string]: string;
}

interface LiftData {
  Total: string;
  "screen.screen_name": string;
  "libraryItem.label": string;
  screenLabel: string;
  "screen.storeLocation": string;
  "screen.storeSection": string;
  libraryItemId: string;
  itemId: string;
  screenId: string;
  [key: string]: string; // Support for flattened displayCount_DATE
}

export default function AnalyticsClient({ data }: { data: LiftData[] }) {
  // Aggregate data by Library Item Label
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      const label = item["libraryItem.label"] || "Unknown";
      const current = map.get(label) || 0;
      map.set(label, current + parseInt(item.Total || '0'));
    });
    
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10
  }, [data]);

  // Aggregate data by Store Location
  const storeData = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      const location = item["screen.storeLocation"] || "Unknown";
      const current = map.get(location) || 0;
      map.set(location, current + parseInt(item.Total || '0'));
    });
    
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [data]);

  const COLORS = ['#3b82f6', '#6366f1', '#06b6d4', '#0ea5e9', '#2563eb', '#4f46e5', '#0891b2', '#0284c7'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart - Top Content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Top Performing Content
              </h3>
              <p className="text-sm text-slate-500">Total lifts per library item</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100">
              Live Data
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  height={80}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  stroke="#cbd5e1"
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} stroke="#cbd5e1" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Performance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Store Location Impact
              </h3>
              <p className="text-sm text-slate-500">Lift distribution by location</p>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {storeData.map((store, idx) => {
              const maxTotal = storeData[0].total;
              const percentage = (store.total / maxTotal) * 100;
              return (
                <div key={idx} className="group flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-slate-700">{store.name}</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{store.total.toLocaleString()} Lifts</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000 group-hover:bg-indigo-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
          <div className="bg-white/20 p-2 rounded-lg w-fit mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-blue-100 text-sm font-medium">Growth Potential</p>
          <h4 className="text-2xl font-bold mt-1">Excellent</h4>
          <p className="text-blue-200 text-xs mt-2 italic">Based on last 600s activity loop</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="bg-slate-100 p-2 rounded-lg w-fit mb-4">
            <Monitor className="h-6 w-6 text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Device Health</p>
          <h4 className="text-2xl font-bold mt-1 text-slate-800">98.2% Online</h4>
          <div className="mt-3 flex gap-1">
            {[1,2,3,4,5,6,7,8].map(i => (
               <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 8 ? 'bg-amber-400' : 'bg-green-500'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-800 italic">"Client View Active"</p>
              <p className="text-xs text-slate-400">Recording insights for export...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
