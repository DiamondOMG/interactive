"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  MapPin,
  Monitor,
  Package,
  Info,
  Calendar,
} from "lucide-react";
import Link from "next/link";

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

export default function StoreDetailClient({
  storeName,
  data,
}: {
  storeName: string;
  data: LiftData[];
}) {
  const [selectedSection, setSelectedSection] = useState("all");

  const storeData = useMemo(() => {
    const filteredByStore = data.filter(
      (item) => item["screen.storeLocation"] === storeName,
    );

    // Filter by section
    if (selectedSection === "all") return filteredByStore;
    if (selectedSection === "main_area")
      return filteredByStore.filter(
        (item) => !item["screen.storeSection"] || item["screen.storeSection"] === "",
      );
    if (selectedSection === "shelf")
      return filteredByStore.filter((item) => item["screen.storeSection"] === "Shelf");
    return filteredByStore;
  }, [data, storeName, selectedSection]);

  // Get available sections for this store
  const availableSections = useMemo(() => {
    const filteredByStore = data.filter(
      (item) => item["screen.storeLocation"] === storeName,
    );
    const hasShelf = filteredByStore.some(
      (item) => item["screen.storeSection"] === "Shelf",
    );
    const hasMainArea = filteredByStore.some(
      (item) => !item["screen.storeSection"] || item["screen.storeSection"] === "",
    );

    return [
      { id: "all", label: "All Sections" },
      ...(hasMainArea ? [{ id: "main_area", label: "Main Area" }] : []),
      ...(hasShelf ? [{ id: "shelf", label: "Shelf" }] : []),
    ];
  }, [data, storeName]);

  const stats = useMemo(() => {
    const totalLifts = storeData.reduce(
      (acc, curr) => acc + parseInt(curr.Total || "0"),
      0,
    );
    const uniqueScreens = new Set(storeData.map((item) => item.screenId)).size;
    const uniqueItems = new Set(storeData.map((item) => item.libraryItemId))
      .size;

    // Aggregation for chart
    const contentMap = new Map<string, number>();
    storeData.forEach((item) => {
      const label = item["libraryItem.label"] || "Unknown";
      const current = contentMap.get(label) || 0;
      contentMap.set(
        label,
        current + parseInt(item.Total || "0"),
      );
    });

    const chartData = Array.from(contentMap.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return { totalLifts, uniqueScreens, uniqueItems, chartData };
  }, [storeData]);

  if (storeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Info className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Store Not Found</h2>
        <p className="text-slate-500 mt-2">
          We couldnt find any data for {storeName}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 text-blue-600 font-bold hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="text-sm font-bold text-blue-600 flex items-center gap-1.5 hover:gap-2 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Overview
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {storeName}
              </h1>
              <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                <Monitor className="h-3.5 w-3.5" />
                {selectedSection !== "all" && (
                  <span className="text-indigo-600 font-medium">
                    {
                      availableSections.find((s) => s.id === selectedSection)
                        ?.label
                    }{" "}
                    •
                  </span>
                )}
                {stats.uniqueScreens} active kiosks in this branch
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-600">Sync Period:</span>
          <span className="text-sm font-medium text-slate-500 underline decoration-blue-500 underline-offset-4">
            Last 10 minutes
          </span>
        </div>
      </div>

      {/* Section Filter */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-indigo-600" />
          Store Sections
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableSections.map((section) => (
            <Link
              key={section.id}
              href={
                section.id === "all"
                  ? `/dashboard/stores/${encodeURIComponent(storeName)}`
                  : `/dashboard/stores/${encodeURIComponent(
                      storeName,
                    )}/sections/${encodeURIComponent(section.label)}`
              }
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                selectedSection === section.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {section.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Total Interactions
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-4xl font-black text-slate-800">
              {stats.totalLifts.toLocaleString()}
            </h4>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              LIFTS
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-indigo-700 bg-indigo-50/30 border-indigo-100">
          <p className="text-indigo-500 text-xs font-bold uppercase tracking-widest">
            Engaged Content
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-4xl font-black">{stats.uniqueItems}</h4>
            <span className="text-xs font-bold">ITEMS</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-blue-700 bg-blue-50/30 border-blue-100">
          <p className="text-blue-500 text-xs font-bold uppercase tracking-widest">
            Store Section Health
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h4 className="text-4xl font-black">100%</h4>
            <span className="text-xs font-bold">STABLE</span>
          </div>
        </div>
      </div>

      {/* Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" />
              Content Popularity at Branch
            </h3>
            <p className="text-sm text-slate-500">
              Distribution of lifts per item
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.chartData}
                layout="vertical"
                margin={{ left: 40, right: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                  stroke="#cbd5e1"
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={24}>
                  {stats.chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#4f46e5" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Screen List */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Monitor className="h-5 w-5 text-blue-400" />
            Connected Screens
          </h3>
          <div className="space-y-4">
            {Array.from(new Set(storeData.map((s) => s.screenLabel))).map(
              (screen, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">{screen}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Online
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              End of Live Data Stream
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
