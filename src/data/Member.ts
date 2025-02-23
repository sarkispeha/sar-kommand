import { GeoJsonPosition } from "@/data/Geo";

// export type MemberData = {
//   name: string;
//   sarMemberId: number;
//   path: GeoJsonPosition[];
//   currentPosition: { lat: number; lng: number };
//   team: string;
// };

export interface MemberData {
  sarMemberId: number;
  name: string;
  team: string;
  path: GeoJsonPosition[];
  position: {
    lng: number;
    lat: number;
  } | null;
}

export type MemberListItem = {
  name: string;
  team: string;
  sarMemberId: number;
};
export type GetMemberDataResponse = MemberData[];
