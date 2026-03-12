'use server';

export async function getMergedLiftData() {
  try {
    // --- 1) คำนวณ startMillis / endMillis สำหรับวันนี้ (GMT+00) ---
    const now = new Date();
    const endMillis = now.getTime();

    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const startMillis = todayUTC.getTime();

    const dd = String(now.getUTCDate()).padStart(2, "0");
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = now.getUTCFullYear();
    const todayKey = `displayCount_${dd}/${mm}/${yyyy}`;

    // --- 2) ดึงข้อมูลจาก AppScript ---
    const appscriptUrl = "https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall";
    const appscriptResponse = await fetch(appscriptUrl);

    if (!appscriptResponse.ok) {
      throw new Error("Failed to fetch data from Google Apps Script");
    }

    const appscriptRaw = await appscriptResponse.json();
    const appscriptData: any[] = Array.isArray(appscriptRaw) ? appscriptRaw : [];

    // --- 3) ดึงข้อมูลจาก Targetr (ใช้ fetch แทน axios เพื่อเลี่ยง url.parse deprecation) ---
    const targetrBase = process.env.TARGETR_BASE_URL || 'https://stacks.targetr.net';
    const targetrUser = process.env.TARGETR_USERNAME || '';
    const targetrPass = process.env.TARGETR_PASSWORD || '';
    
    const searchParams = new URLSearchParams({
      startMillis: startMillis.toString(),
      endMillis: endMillis.toString(),
      aggregation: "screen_and_item",
      groupId: "13908CF4A44ABA",
      fields: "screen.ProjectName,libraryItem.label,screenLabel,screen.storeLocation,libraryItemId,itemId,screenId,displayCount",
    });

    const authHeader = `Basic ${Buffer.from(`${targetrUser}:${targetrPass}`).toString('base64')}`;
    
    const targetrResponse = await fetch(`${targetrBase}/api/display-summary/full.csv?${searchParams.toString()}`, {
      headers: {
        'Authorization': authHeader
      }
    });

    if (!targetrResponse.ok) {
      throw new Error(`Targetr API failed: ${targetrResponse.statusText}`);
    }

    const csvData = await targetrResponse.text();
    const lines = csvData.trim().split("\n");
    if (lines.length <= 1) return appscriptData; // ถ้าไม่มีข้อมูล Targetr คืนค่า Appscript ไปก่อน

    const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"(.*)"$/, "$1"));

    const targetrMap = new Map();
    lines.slice(1).forEach((line) => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj: any = {};
      headers.forEach((header, index) => {
        let value = values[index] || "";
        obj[header] = value.trim().replace(/^"(.*)"$/, "$1");
      });
      
      const key = `${obj.screenId}_${obj.itemId}`;
      targetrMap.set(key, obj);
    });

    // --- 4) Merge ---
    const mergedData = appscriptData.map((appItem) => {
      const key = `${(appItem.screenId || "").trim()}_${(appItem.itemId || "").trim()}`;
      const targetrItem = targetrMap.get(key);
      const merged = { ...appItem, screen_item_id: key };

      if (targetrItem && targetrItem.displayCount) {
        const newCount = parseInt(targetrItem.displayCount, 10) || 0;
        const existingCount = parseInt(appItem[todayKey] || "0", 10) || 0;
        const diff = newCount - existingCount;

        merged[todayKey] = String(newCount);
        if (diff !== 0) {
          merged["Total"] = String((parseInt(appItem["Total"], 10) || 0) + diff);
        }
      }
      return merged;
    });

    return mergedData;
  } catch (error) {
    console.error("Error in getMergedLiftData action:", error);
    throw error;
  }
}
