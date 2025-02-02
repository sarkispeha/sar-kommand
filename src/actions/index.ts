"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";
import type { Position } from "geojson";

export async function editSnippet(id: number, title: string) {
  console.log("update snippet", id, title);
  await db.snippet.update({
    where: { id },
    data: { title },
  });
  redirect(`/server-action-test/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  console.log("delete snippet", id);
  await db.snippet.delete({
    where: { id },
  });
  redirect("/server-action-test");
}

/**
 * Saves a geographic coordinate to the database.
 * @param position - A GeoJSON Position tuple containing [longitude, latitude]
 * @returns Promise that resolves when the coordinate is saved
 */
export async function saveMemberPosition(position: Position) {
  console.log("save position", position);
  await db.memberCoord.create({
    data: {
      lng: position[0],
      lat: position[1],
    },
  });
}
