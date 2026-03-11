import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";

    const url = "https://script.google.com/macros/s/AKfycbyZRJ4yoRWuvatmpEzZyc8hQFHdpfMHgPia7ZMN1gzLxByLL_rDo8CCr19qG8pgidGC/exec?action=getall";
    const response = await fetch(url);

    if (!response.ok) {
       throw new Error("Failed to fetch data from Google Apps Script");
    }

    const appscriptData = await response.json();
    let data = Array.isArray(appscriptData) ? appscriptData : [];

    if (section === "main_area") {
      data = data.filter((item: any) => !item["screen.storeSection"] || item["screen.storeSection"] === "");
    }

    if (section === "shelf") {
      data = data.filter((item: any) => item["screen.storeSection"] === "Shelf");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error returning AppScript data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
