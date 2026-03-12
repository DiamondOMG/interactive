import { NextRequest, NextResponse } from "next/server";
import targetrApi from "@/lib/axios_targetr";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    //         ?startmill=1773111601000&endmill=1773129601000
    // --- คำนวณค่า Default (เวลาไทย 0:00 ถึง ปัจจุบัน) ---
    const now = new Date();
    // 0:00 UTC ของวันนี้
    const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    // 0:00 ไทย คือ 17:00 UTC ของเมื่อวาน (ถอยไป 7 ชม.)
    const defaultStart = (startOfTodayUTC.getTime() - (7 * 60 * 60 * 1000)).toString();
    const defaultEnd = Date.now().toString();

    // รับค่าจาก parameters ถ้าไม่มีให้ใช้ค่า default ที่คำนวณไว้
    const startmill = searchParams.get("startmill") || defaultStart;
    const endmill = searchParams.get("endmill") || defaultEnd;

    // เรียก API ของ targetr
    const response = await targetrApi.get("/api/display-summary/full.csv", {
      params: {
        startMillis: startmill,
        endMillis: endmill,
        aggregation: "screen_and_item",
        groupId: "13908CF4A44ABA",
        fields:
          "screen.ProjectName,libraryItem.label,screenLabel,screen.storeLocation,libraryItemId,itemId,screenId,displayCount",
      },
    });

    // แปลง CSV เป็น JSON
    const csvData = response.data;
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const jsonData = lines
      .slice(1)
      .map((line: string) => {
        // ใช้ split แทน match เพื่อให้รองรับ field ที่ว่าง (,,)
        // regex นี้จะ split ด้วย comma ที่อยู่นอกเครื่องหมายคำพูดเท่านั้น
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj: Record<string, string> = {};

        headers.forEach((header: string, index: number) => {
          let value = values[index] || "";
          // ลบเครื่องหมายคำพูดออก ขจัดช่องว่าง และตัวอักษรพิเศษ
          value = value.replace(/^"(.*)"$/, "$1").trim();
          obj[header.trim()] = value;
        });

        return obj;
      });

    return NextResponse.json(jsonData);
  } catch (error: unknown) {
    console.error("Error calling Targetr API:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Targetr API Error",
          message: error.message,
          status: error.response?.status,
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
