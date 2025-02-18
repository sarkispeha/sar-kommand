import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const members = await db.member.findMany({
      include: {
        coords: {
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
    });

    const formattedMembers = members.map((member) => ({
      name: `Member ${member.id}`,
      team: "Team A",
      position: member.coords[0]
        ? {
            lng: member.coords[0].lng,
            lat: member.coords[0].lat,
          }
        : null,
    }));

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
