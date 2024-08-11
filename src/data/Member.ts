import { GeoJsonPosition } from "@/data/Geo";

export type MemberData = {
  name: string;
  path: GeoJsonPosition[];
  currentPosition: { lat: number; lng: number };
  team: string;
};

export type MemberListItem = { name: string; team: string };
export type GetMemberDataResponse = MemberData[];
