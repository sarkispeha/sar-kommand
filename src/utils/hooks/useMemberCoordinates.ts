import { useState, useEffect } from "react";
import type { MemberCoord } from "@prisma/client";

/**
 * Gets member coordinates via Server-Sent Events
 * Only returns the last member coordinate at the moment
 * @param endpoint The SSE endpoint URL (defaults to "/api/coordinates")
 * @returns The most recent member coordinate
 */
export function useMemberCoordinates(
  endpoint = "/api/coordinates"
): MemberCoord | null {
  const [latestCoordinate, setLatestCoordinate] = useState<MemberCoord | null>(
    null
  );

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      try {
        const coordinates: MemberCoord[] = JSON.parse(event.data);
        if (coordinates.length > 0) {
          // Get the most recent coordinate
          setLatestCoordinate(coordinates[0]);
        }
      } catch (error) {
        console.error("Error parsing coordinate data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource connection failed:", error);
      eventSource.close();
    };

    // Clean up the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return latestCoordinate;
}
