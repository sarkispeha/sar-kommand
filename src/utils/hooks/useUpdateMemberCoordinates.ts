import { useQuery } from "@tanstack/react-query";
import type { MemberCoord } from "@prisma/client";
import { GeoJsonPosition } from "@/data/Geo";

/**
 * Gets member coordinates via React Query
 * Tracks multiple members and their latest coordinates
 * @param selectedMemberIds Array of member IDs to track
 * @returns Object with member IDs to their latest coordinates
 */
export function useUpdateMemberCoordinates(
  selectedMemberIds: number[] = []
): Record<number, GeoJsonPosition> {
  const { data: coordinates = [] } = useQuery<MemberCoord[]>({
    queryKey: ["coordinates", selectedMemberIds],
    queryFn: async () => {
      const response = await fetch("/api/coordinates");
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }
      return response.json();
    },
    refetchInterval: 2000,
    enabled: selectedMemberIds.length > 0,
    select: (data) =>
      data.filter((coord) => selectedMemberIds.includes(coord.sarMemberId)),
  });

  // Convert the filtered coordinates array to the format:
  // { [sarMemberId]: { lat, lng } }
  const memberPositions: Record<number, GeoJsonPosition> = {};

  coordinates.forEach((coord) => {
    memberPositions[coord.sarMemberId] = {
      lat: coord.lat,
      lng: coord.lng,
    };
  });

  return memberPositions;
}
