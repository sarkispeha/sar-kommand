import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the latest 100 coordinates
    const coordinates = await db.memberCoord.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    // Return as JSON response
    return NextResponse.json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return new NextResponse("Error fetching coordinates", { status: 500 });
  }
}
