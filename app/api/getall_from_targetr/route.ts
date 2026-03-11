import { NextRequest, NextResponse } from "next/server";
import targetrApi from "@/lib/axios_targetr";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // รับค่า parameters พร้อม default values
    const startmill = searchParams.get("startmill") || "1704042000000";
    const endmill = searchParams.get("endmill") || Date.now().toString();

    // เรียก API ของ targetr
    const response = await targetrApi.get("/api/display-summary/full.csv", {
      params: {
        startMillis: startmill,
        endMillis: endmill,
        aggregation: "screen_and_item",
        groupId: "13908CF4A44ABA",
        fields:
          "screen.screen_name,libraryItem.label,screenLabel,screen.storeLocation,libraryItemId,itemId,screenId,displayCount",
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
