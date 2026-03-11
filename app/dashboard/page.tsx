import React from "react";
import DashboardClient from "./DashboardClient";

// Define types for the API response
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

// ISR configuration: Revalidate every 60 seconds
export const revalidate = 600;

async function getLiftData(): Promise<LiftData[]> {
  const url =
    "https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall";

  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data from API");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Server component
export default async function DashboardPage() {
  const rawData = await getLiftData();
  const data = Array.isArray(rawData) ? rawData : [];

  return <DashboardClient initialData={data} />;
}
