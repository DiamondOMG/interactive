"use client";

import { useState } from "react";
import Link from "next/link";

// Define types for the API response
interface DisplayCounts {
  [key: string]: string;
}

interface LiftData {
  Total: string;
  libraryItemLabel: string;
  screenLabel: string;
  storeLocation: string;
  storeSection: string;
  libraryItemId: string;
  itemId: string;
  screenId: string;
  displayCounts: DisplayCounts;
}

// Section filter component
function SectionFilter({
  currentSection,
  onSectionChange,
}: {
  currentSection: string;
  onSectionChange: (section: string) => void;
}) {
  const sections = [
    { id: "all", label: "All", count: null },
    { id: "main_area", label: "Main Area", count: null },
    { id: "shelf", label: "Shelf", count: null },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            currentSection === section.id
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}

// StatCard component
function StatCard({
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
      {/* Decorative gradient background on hover */}
      <div className="absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-blue-50 opacity-0 blur-3xl transition-opacity group-hover:opacity-100"></div>
    </div>
  );
}

export default function DashboardClient({
  initialData,
}: {
  initialData: LiftData[];
}) {
  const [selectedSection, setSelectedSection] = useState("all");

  // Filter data based on selected section
  function hasAllFields(item: LiftData) {
    return (
      item.Total?.toString().trim() !== "" &&
      item.libraryItemLabel?.toString().trim() !== "" &&
      item.screenLabel?.toString().trim() !== "" &&
      item.storeLocation?.toString().trim() !== "" &&
      item.itemId?.toString().trim() !== "" &&
      item.screenId?.toString().trim() !== "" &&
      item.libraryItemId?.toString().trim() !== ""
    );
  }

  const filteredData = initialData.filter((item) => {
    // section match
    let sectionMatch = true;
    if (selectedSection === "main_area")
      sectionMatch = !item.storeSection || item.storeSection === "";
    if (selectedSection === "shelf")
      sectionMatch = item.storeSection === "Shelf";

    // only include rows where all required fields are present
    return sectionMatch && hasAllFields(item);
  });

  // Calculations for Summary
  const totalLifts = filteredData.reduce(
    (acc, curr) => acc + parseInt(curr.Total || "0"),
    0,
  );
  const uniqueContents = new Set(
    filteredData.map((item) => item.libraryItemLabel),
  ).size;
  const uniqueStores = new Set(filteredData.map((item) => item.storeLocation))
    .size;
  const uniqueScreens = new Set(filteredData.map((item) => item.screenId)).size;

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

          {/* Detailed Data Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                Detailed Activity Log
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search contents or stores..."
                  className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Content Label
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Store / Section
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Device
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Interaction
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Unique ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-blue-50/30 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {item.libraryItemLabel.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">
                              {item.libraryItemLabel}
                            </div>
                            <div className="text-xs text-slate-400">
                              ID: {item.libraryItemId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/dashboard/stores/${encodeURIComponent(item.storeLocation)}`}
                            className="group/link inline-block w-fit"
                          >
                            <div className="text-sm font-bold text-slate-700 group-hover/link:text-blue-600 transition-colors flex items-center gap-1">
                              {item.storeLocation}
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
                            href={`/dashboard/stores/${encodeURIComponent(item.storeLocation)}/sections/${encodeURIComponent(item.storeSection || "Main Area")}`}
                            className="text-xs text-slate-500 hover:text-blue-500 hover:underline transition-colors block w-fit mt-0.5"
                          >
                            {item.storeSection || "Main Area"}
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
                          {item.screenLabel}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-blue-700">
                            {item.Total}
                          </div>
                          <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.min((parseInt(item.Total) / 50) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">
                          #{item.itemId}
                        </code>
                      </td>
                    </tr>
                  ))}
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
              <span>Showing {filteredData.length} interaction loops</span>
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
