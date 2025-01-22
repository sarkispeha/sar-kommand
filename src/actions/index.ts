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

export async function savePosition(position: Position) {
  console.log("save position", position);
  await db.standardCoord.create({
    data: {
      lng: position[0],
      lat: position[1],
    },
  });
}
