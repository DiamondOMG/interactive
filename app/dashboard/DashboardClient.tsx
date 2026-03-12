"use client";

import React, { useState, useMemo } from "react";
import { useStore, useFilteredData } from "@/lib/store";
import { LiftData } from "@/lib/types";
import Link from "next/link";

import StatCard from "@/components/dashboard/StatCard";
import SectionFilter from "@/components/dashboard/SectionFilter";

export default function DashboardClient() {
  const { 
    selectedSection, 
    setSelectedSection,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const filteredData = useFilteredData();

  // Calculations for Summary
  const totalLifts = filteredData.reduce(
    (acc, curr) => acc + parseInt(curr.Total || "0"),
    0,
  );
  const uniqueContents = new Set(
    filteredData.map((item) => item["libraryItem.label"]),
  ).size;
  const uniqueStores = new Set(filteredData.map((item) => item["screen.storeLocation"]))
    .size;
  const uniqueScreens = new Set(filteredData.map((item) => item.screenId)).size;

  // State for tree-view expansion
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (projectName: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectName]: !prev[projectName]
    }));
  };

  // Helper: สร้าง displayCount key จาก Date
  const makeDayKey = (date: Date) => {
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = date.getUTCFullYear();
    return `displayCount_${dd}/${mm}/${yyyy}`;
  };

  // 3-day keys: วันนี้, เมื่อวาน, เมื่อวานซืน (คำนวณฝั่ง client เพื่อเลี่ยง hydration mismatch)
  const [dayKeys, setDayKeys] = useState<{ key: string; label: string }[]>([]);

  React.useEffect(() => {
    const now = new Date();
    const days = [0, 1, 2].map(offset => {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - offset);
      return {
        key: makeDayKey(d),
        label: `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')}`,
      };
    });
    setDayKeys(days);
  }, []);

  // Group data by Project Name
  const groupedByProject = useMemo(() => {
    const groups: Record<string, { items: LiftData[]; total: number; days: number[] }> = {};
    filteredData.forEach(item => {
      const projectName = item["screen.ProjectName"] || "No Project";
      if (!groups[projectName]) {
        groups[projectName] = { items: [], total: 0, days: [0, 0, 0] };
      }
      groups[projectName].items.push(item);
      groups[projectName].total += parseInt(item.Total || "0");
      dayKeys.forEach((dk, i) => {
        groups[projectName].days[i] += parseInt(item[dk.key] || "0");
      });
    });
    return groups;
  }, [filteredData, dayKeys]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Decorative for modern look */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-slate-200 bg-white p-6 lg:block">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            OMG Interactive
          </span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics (NEW)
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Devices
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Lift and Learn Insights
              </h2>
              <p className="text-sm text-slate-500">
                Real-time engagement metrics across stores
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live Updates Enabled (ISR 60s)
              </div>
              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all hover:scale-105 active:scale-95">
                Export Data
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Section Filter */}
          <div className="mb-6">
            <SectionFilter
              currentSection={selectedSection}
              onSectionChange={setSelectedSection}
            />
          </div>

          {/* Summary Stats */}
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Interactions"
              value={
                <span suppressHydrationWarning>
                  {totalLifts.toLocaleString()}
                </span>
              }
              description="Total lifts detected across all units"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              }
              trend="+12.5%"
              color="blue"
            />
            <StatCard
              title="Unique Contents"
              value={
                <span suppressHydrationWarning>
                  {uniqueContents.toLocaleString()}
                </span>
              }
              description="Active library items in circulation"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              }
              color="indigo"
            />
            <StatCard
              title="Active Locations"
              value={
                <span suppressHydrationWarning>
                  {uniqueStores.toLocaleString()}
                </span>
              }
              description="Total store locations monitored"
              icon={
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </>
              }
              color="cyan"
            />
            <StatCard
              title="Monitored Screens"
              value={
                <span suppressHydrationWarning>
                  {uniqueScreens.toLocaleString()}
                </span>
              }
              description="Individual kiosk units connected"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              }
              color="sky"
            />
          </div>

          {/* Project Hierarchy Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                Project Hierarchy View
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search contents or stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[25%] min-w-[200px]">
                      Content Label
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[20%] min-w-[150px]">
                      Store / Section
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%] min-w-[120px]">
                      Device
                    </th>
                    {dayKeys.map(dk => (
                      <th key={dk.key} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-24">
                        {dk.label}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-24">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(groupedByProject).map(([projectName, group]) => {
                    const isExpanded = expandedProjects[projectName];
                    return (
                      <React.Fragment key={projectName}>
                        {/* --- Project Parent Row --- */}
                        <tr
                          className="bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer group"
                          onClick={() => toggleProject(projectName)}
                        >
                          <td className="px-6 py-3" colSpan={3}>
                            <div className="flex items-center gap-2">
                              <svg
                                className={`h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="font-black text-slate-800 text-base tracking-tight">
                                {projectName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-[10px] font-bold text-slate-500">
                                {group.items.length} items
                              </span>
                            </div>
                          </td>
                          {group.days.map((count, di) => (
                            <td key={di} className="px-6 py-3 text-right">
                              <div className="font-black text-indigo-700">
                                {count.toLocaleString()}
                              </div>
                            </td>
                          ))}
                          <td className="px-6 py-3 text-right">
                            <div className="font-black text-blue-800">
                              {group.total.toLocaleString()}
                            </div>
                          </td>
                        </tr>

                        {/* --- Child Rows (expanded) --- */}
                        {isExpanded && group.items.map((item, iIdx) => (
                          <tr
                            key={`${projectName}-${iIdx}`}
                            className="transition-colors hover:bg-blue-50/30 group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  {item.screenLabel?.substring(0, 2) || "NA"}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-800">
                                    {item.screenLabel}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    ID: {item.screenId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <Link
                                  href={`/dashboard/stores/${encodeURIComponent(item["screen.storeLocation"])}`}
                                  className="group/link inline-block w-fit"
                                >
                                  <div className="text-sm font-bold text-slate-700 group-hover/link:text-blue-600 transition-colors flex items-center gap-1">
                                    {item["screen.storeLocation"]}
                                    <svg
                                      className="h-3 w-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  </div>
                                </Link>
                                <Link
                                  href={`/dashboard/stores/${encodeURIComponent(item["screen.storeLocation"])}/sections/${encodeURIComponent(item["screen.storeSection"] || "Main Area")}`}
                                  className="text-xs text-slate-500 hover:text-blue-500 hover:underline transition-colors block w-fit mt-0.5"
                                >
                                  {item["screen.storeSection"] || "Main Area"}
                                </Link>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
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
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {item["libraryItem.label"]}
                              </div>
                            </td>
                            {dayKeys.map(dk => (
                              <td key={dk.key} className="px-6 py-4 text-right">
                                <div className="text-lg font-bold text-indigo-600">
                                  {item[dk.key] || "0"}
                                </div>
                              </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                              <div className="text-lg font-bold text-blue-700">
                                {item.Total}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="py-20 text-center">
                <div className="text-slate-400 mb-2">No data available</div>
                <p className="text-sm text-slate-500">
                  Try changing the section filter or check your API connection.
                </p>
              </div>
            )}
            <div className="border-t border-slate-100 bg-white px-6 py-4 text-xs text-slate-500 flex justify-between">
              <span>{Object.keys(groupedByProject).length} projects · {filteredData.length} items</span>
              <span suppressHydrationWarning>
                Last synced: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
