import { useQuery } from "@tanstack/react-query";
import type { MemberCoord } from "@prisma/client";
import { GeoJsonPosition } from "@/data/Geo";

/**
 * Gets the latest coordinates for selected members
 * @param selectedSarMemberIds Array of member IDs to track
 * @returns Object with member IDs to their latest coordinates
 */
export function useUpdateMemberCoordinates(
  selectedSarMemberIds: number[] = []
): Record<number, GeoJsonPosition> {
  const memberIdsParam =
    selectedSarMemberIds.length > 0
      ? `?memberIds=${selectedSarMemberIds.join(",")}`
      : "";

  const { data: coordinates = [] } = useQuery<MemberCoord[]>({
    queryKey: ["coordinates", selectedSarMemberIds],
    queryFn: async () => {
      //TODO : this might not be the most NEXT.js way to do this, there might be a better way to use query params
      const response = await fetch(`/api/coordinates${memberIdsParam}`);
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }
      return response.json();
    },
    refetchInterval: 5000,
    enabled: selectedSarMemberIds.length > 0,
  });

  // Convert array of coordinates to a map of sarMemberId -> position
  const memberPositions: Record<number, GeoJsonPosition> = {};

  coordinates.forEach((coord) => {
    memberPositions[coord.sarMemberId] = {
      lat: coord.lat,
      lng: coord.lng,
    };
  });

  return memberPositions;
}
