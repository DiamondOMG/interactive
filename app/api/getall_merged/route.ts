import { NextRequest, NextResponse } from "next/server";
import targetrApi from "@/lib/axios_targetr";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";

    // --- 1) คำนวณ startMillis / endMillis สำหรับวันนี้ (GMT+00) ---
    const now = new Date();
    const endMillis = now.getTime(); // เวลา ณ ตอนนี้

    // startMillis = วันนี้ 00:00:00.000 UTC
    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const startMillis = todayUTC.getTime();

    // วันที่ในรูปแบบ DD/MM/YYYY (UTC)
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = now.getUTCFullYear();
    const todayKey = `displayCount_${dd}/${mm}/${yyyy}`;

    // --- 2) ดึงข้อมูลจาก AppScript (ฐานหลัก) ---
    const appscriptUrl =
      "https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall";
    const appscriptResponse = await fetch(appscriptUrl, {
      next: { revalidate: 60 },
    });

    if (!appscriptResponse.ok) {
      throw new Error("Failed to fetch data from Google Apps Script");
    }

    const appscriptRaw = await appscriptResponse.json();
    let appscriptData: Record<string, string>[] = Array.isArray(appscriptRaw)
      ? appscriptRaw
      : [];

    // --- 3) ดึงข้อมูลจาก Targetr (เฉพาะวันนี้) ---
    const targetrResponse = await targetrApi.get(
      "/api/display-summary/full.csv",
      {
        params: {
          startMillis: startMillis.toString(),
          endMillis: endMillis.toString(),
          aggregation: "screen_and_item",
          groupId: "13908CF4A44ABA",
          fields:
            "screen.screen_name,libraryItem.label,screenLabel,screen.storeLocation,libraryItemId,itemId,screenId,displayCount",
        },
      }
    );

    // แปลง CSV เป็น JSON
    const csvData = targetrResponse.data;
    const lines = (csvData as string).trim().split("\n");
    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    const targetrData: Record<string, string>[] = lines
      .slice(1)
      .map((line: string) => {
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj: Record<string, string> = {};
        headers.forEach((header: string, index: number) => {
          let value = values[index] || "";
          value = value.replace(/^"(.*)"$/, "$1").trim();
          // ลบเครื่องหมายคำพูดจาก header ด้วยถ้ามี
          const cleanHeader = header.trim().replace(/^"(.*)"$/, "$1");
          obj[cleanHeader] = value;
        });
        return obj;
      });

    // --- 4) สร้าง Map จาก Targetr โดยใช้ screenId+itemId เป็น key ---
    const targetrMap = new Map<string, Record<string, string>>();
    for (const item of targetrData) {
      // Trim เพื่อความชัวร์ เผื่อมี space ติดมา
      const sId = (item["screenId"] || "").trim();
      const iId = (item["itemId"] || "").trim();
      if (sId && iId) {
        const key = `${sId}_${iId}`;
        targetrMap.set(key, item);
      }
    }

    // --- 5) Merge: ยึด AppScript เป็นหลัก แล้วเติม displayCount วันนี้จาก Targetr ---
    const mergedData = appscriptData.map((appItem) => {
      const sId = (appItem["screenId"] || "").trim();
      const iId = (appItem["itemId"] || "").trim();
      const key = `${sId}_${iId}`;
      const targetrItem = targetrMap.get(key);

      // Clone appItem เพื่อไม่แก้ต้นฉบับ
      const merged: Record<string, any> = { ...appItem };

      // ใส่ข้อมูลระบุตัวตน (เดิมใช้เพื่อ debug)
      merged["screen_item_id"] = key;

      if (targetrItem && targetrItem.displayCount) {
        const newCount = parseInt(targetrItem.displayCount, 10) || 0;

        // เช็คว่า AppScript มี field วันนี้อยู่แล้วหรือไม่
        const existingCountStr = appItem[todayKey];
        const existingCount = existingCountStr
          ? parseInt(existingCountStr, 10) || 0
          : 0;

        // คำนวณผลต่าง
        const diff = newCount - existingCount;

        // อัพเดท displayCount วันนี้
        merged[todayKey] = String(newCount);

        // อัพเดท Total (บวกผลต่าง)
        if (diff !== 0) {
          const currentTotal = parseInt(appItem["Total"], 10) || 0;
          merged["Total"] = String(currentTotal + diff);
        }
      }

      return merged;
    });

    // --- 6) กรอง section (เหมือน AppScript API เดิม) ---
    let data = mergedData;

    if (section === "main_area") {
      data = data.filter(
        (item) =>
          !item["screen.storeSection"] || item["screen.storeSection"] === ""
      );
    }

    if (section === "shelf") {
      data = data.filter(
        (item) => item["screen.storeSection"] === "Shelf"
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error in merged API:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Targetr API Error",
          message: error.message,
          status: error.response?.status,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
