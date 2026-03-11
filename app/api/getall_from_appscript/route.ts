import { NextRequest, NextResponse } from "next/server";
import appscriptData from "@/getall_from_appscript.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "all";

    let data = Array.isArray(appscriptData) ? appscriptData : [];

    if (section === "main_area") {
      data = data.filter((item) => !item.storeSection || item.storeSection === "");
    }

    if (section === "shelf") {
      data = data.filter((item) => item.storeSection === "Shelf");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error returning AppScript data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
