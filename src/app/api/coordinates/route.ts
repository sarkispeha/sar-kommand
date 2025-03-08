import { Prisma } from "@prisma/client";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check if specific member IDs were requested
    const { searchParams } = new URL(request.url);
    const memberIdsParam = searchParams.get("memberIds");

    // Parse member IDs if provided
    const memberIds = memberIdsParam
      ? memberIdsParam.split(",").map((id) => parseInt(id, 10))
      : undefined;

    // Use a raw query to get the latest coordinate for each member
    const latestCoordinates = await db.$queryRaw`
      WITH RankedCoordinates AS (
        SELECT 
          *, 
          ROW_NUMBER() OVER (PARTITION BY "sarMemberId" ORDER BY "timestamp" DESC) as rn
        FROM "MemberCoord"
        ${
          memberIds
            ? Prisma.sql`WHERE "sarMemberId" IN (${Prisma.join(memberIds)})`
            : Prisma.empty
        }
      )
      SELECT id, lng, lat, "sarMemberId", timestamp
      FROM RankedCoordinates
      WHERE rn = 1
      ORDER BY "timestamp" DESC
    `;

    // Return as JSON response
    return NextResponse.json(latestCoordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return new NextResponse("Error fetching coordinates", { status: 500 });
  }
}
