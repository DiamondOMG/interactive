import DashboardClient from "./DashboardClient";
import StoreInitializer from "@/components/StoreInitializer";
import { LiftData } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | OMG Interactive",
  description: "Monitor real-time interactions, unique content engagement, and store performance.",
};

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

  return (
    <>
      <StoreInitializer data={data} />
      <DashboardClient />
    </>
  );
}
