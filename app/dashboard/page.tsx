import DashboardClient from "./DashboardClient";
import StoreInitializer from "@/components/StoreInitializer";
import { Metadata } from "next";
import { getLiftData } from "@/lib/api";

export const metadata: Metadata = {
  title: "Dashboard Overview | OMG Interactive",
  description: "Monitor real-time interactions, unique content engagement, and store performance.",
};

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
