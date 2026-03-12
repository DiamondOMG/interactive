import DashboardClient from "./DashboardClient";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard Overview | OMG Interactive",
  description: "Monitor real-time interactions, unique content engagement, and store performance.",
};

// Server component
export default async function DashboardPage() {
  return <DashboardClient />;
}
