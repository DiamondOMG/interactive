import { getLiftData } from "@/lib/api";
import StoreInitializer from "@/components/StoreInitializer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ดึงข้อมูลครั้งเดียวที่ระดับบนสุดของ Dashboard
  const data = await getLiftData();

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 
        StoreInitializer จะทำงานเมื่อ DashboardLayout ถูกโหลดครั้งแรก 
        และเนื่องจาก Layout ไม่ค่อยถูก re-render เมื่อเปลี่ยนหน้าย่อย 
        ข้อมูลใน Zustand จะคงอยู่ตลอด (Persistence)
      */}
      <StoreInitializer data={data} />
      {children}
    </div>
  );
}
