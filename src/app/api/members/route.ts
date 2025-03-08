import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const members = await db.member.findMany();

    const formattedMembers = members.map((member) => ({
      name: `${member.id}`,
      team: "Team A",
      sarMemberId: member.id,
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
