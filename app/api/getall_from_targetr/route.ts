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
          "libraryItem.label,screenLabel,screen.storeLocation,libraryItemId,itemId,screenId,displayCount",
      },
    });

    // แปลง CSV เป็น JSON
    const csvData = response.data;
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");

    const jsonData = lines
      .slice(1)
      .map((line: string) => {
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const obj: Record<string, string> = {};

        headers.forEach((header: string, index: number) => {
          let value = values[index] || "";
          // ลับเครื่องหมายคำพูดออกและ trim whitespace/r/n
          value = value.replace(/^"(.*)"$/, "$1").trim();
          obj[header.trim()] = value;
        });

        return obj;
      })
      .filter(
        (item: Record<string, string>) =>
          item.displayCount && item.displayCount !== "",
      );

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
