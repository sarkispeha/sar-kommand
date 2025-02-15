"use client";

import { useEffect, useState } from "react";
import type { MemberCoord } from "@prisma/client";

export const CoordinatesList = () => {
  const [coordinates, setCoordinates] = useState<MemberCoord[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/coordinates");

    eventSource.onmessage = (event) => {
      const coords = JSON.parse(event.data);
      setCoordinates(coords);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      {coordinates.map((coord) => (
        <p key={coord.id}>
          {`memberId: ${coord.sarMemberId}, memberCoordId: ${coord.id}, lat: ${coord.lat}, lng: ${coord.lng}`}
        </p>
      ))}
    </div>
  );
};
