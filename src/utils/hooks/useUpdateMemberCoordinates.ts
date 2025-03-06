import { useState, useEffect } from "react";
import type { MemberCoord } from "@prisma/client";
import { GeoJsonPosition } from "@/data/Geo";

/**
 * Gets member coordinates via Server-Sent Events
 * Tracks multiple members and their latest coordinates
 * @param selectedMemberIds Array of member IDs to track
 * @param endpoint The SSE endpoint URL (defaults to "/api/coordinates")
 * @returns Object with member IDs to their latest coordinates
 */
export function useMemberCoordinates(
  selectedMemberIds: number[] = [],
  endpoint = "/api/coordinates"
): Record<number, GeoJsonPosition> {
  const [memberPositions, setMemberPositions] = useState<
    Record<number, GeoJsonPosition>
  >({});

  useEffect(() => {
    if (selectedMemberIds.length === 0) return;

    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      try {
        const coordinates: MemberCoord[] = JSON.parse(event.data);

        // Filter coordinates for selected members only
        const relevantCoordinates = coordinates.filter((coord) =>
          selectedMemberIds.includes(coord.sarMemberId)
        );

        if (relevantCoordinates.length > 0) {
          // Update coordinates for each member, converting to GeoJsonPosition format
          setMemberPositions((prev) => {
            const updated = { ...prev };

            relevantCoordinates.forEach((coord) => {
              updated[coord.sarMemberId] = {
                lat: coord.lat,
                lng: coord.lng,
              };
            });

            return updated;
          });
        }
      } catch (error) {
        console.error("Error parsing coordinate data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource connection failed:", error);
      eventSource.close();
    };

    // Clean up the connection when the component unmounts or selectedMemberIds changes
    return () => {
      eventSource.close();
    };
  }, [endpoint, selectedMemberIds]);

  return memberPositions;
}
