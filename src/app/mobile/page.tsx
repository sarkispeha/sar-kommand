"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import type { Position } from "geojson";

const MobileTrackerPage = () => {
  const [currentPosition, setCurrentPosition] = useState<Position>([]);
  const [currentTrack, setCurrentTrack] = useState<Position[]>([]);
  const trackPositionHandler = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("TRACKING", position);
      setCurrentPosition([position.coords.longitude, position.coords.latitude]);
      setCurrentTrack([...currentTrack, currentPosition]);
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
