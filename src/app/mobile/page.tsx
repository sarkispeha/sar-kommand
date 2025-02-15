"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import type { Position } from "geojson";
import * as actions from "@/actions";

const MobileTrackerPage = () => {
  const [currentPosition, setCurrentPosition] = useState<Position>([]);
  const [currentTrack, setCurrentTrack] = useState<Position[]>([]);

  const trackAndSavePosition = async (formData: FormData) => {
    const memberIdStr = formData.get("memberId");
    const memberId = parseInt(memberIdStr as string, 10);

    if (!memberIdStr || isNaN(memberId)) {
      alert("Please enter a valid number for member ID");
      return;
    }

    // return a promise that resolves when we get the position
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newPosition: Position = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCurrentPosition(newPosition);
          setCurrentTrack((prev) => [...prev, newPosition]);

          await actions.saveMemberPosition(newPosition, memberId);
          resolve(position);
        },
        (error) => reject(error)
      );
    });
  };

  return (
    <div>
      <h1>Track your position</h1>
      <form action={trackAndSavePosition} className="space-y-4">
        <div>
          <input
            type="number" // TODO: might need to change to string
            name="memberId"
            placeholder="Enter Member ID"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <Button
          type="submit"
          className={
            "px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white"
          }
        >
          Track & Save Position
        </Button>
      </form>
      {currentTrack.join(",\n")}
    </div>
  );
};

export default MobileTrackerPage;
