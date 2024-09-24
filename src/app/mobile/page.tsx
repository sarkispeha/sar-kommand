"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import type { Position } from "geojson";

const MobileTrackerPage = () => {
  const [currentPosition, setCurrentPosition] = useState<Position>([]);
  const [currentTrack, setCurrentTrack] = useState<Position[]>([]);
  const trackPositionHandler = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log("TRACKING", position);
      setCurrentPosition([position.coords.longitude, position.coords.latitude]);
      setCurrentTrack([...currentTrack, currentPosition]);

      try {
        const response = await fetch("/api/mobile-position", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          }),
        });

        if (response.ok) {
          console.log("Position saved successfully");
        } else {
          console.error("Failed to save position");
        }
      } catch (error) {
        console.error("Error saving position:", error);
      }
    });
    console.log("CURRENT TRACK", currentTrack);
  };
  return (
    <div>
      <h1>Track your position</h1>
      <Button
        className={
          "px-6 py-3 text-lg bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white"
        }
        onClick={trackPositionHandler}
      >
        Track Position
      </Button>
      {currentTrack.join(",\n")}
    </div>
  );
};

export default MobileTrackerPage;
