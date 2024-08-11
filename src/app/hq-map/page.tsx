"use client";

import Map from "@/components/Map/MapboxMap";
import ActionButtons from "@/components/Map/MapActionButtons";
import MemberList from "@/components/Map/MemberList";
import { MemberListItem } from "@/data/Member";
import { useQuery } from "@tanstack/react-query";
// import useFetch from "@/utils/hooks/useFetch";
import { useState } from "react";
import { GeoJsonPosition } from "@/data/Geo";

export default function HqMapPage() {
  const [issPosition, setIssPosition] = useState<GeoJsonPosition | null>(null);
  const [isTrackingIss, setIsTrackingIss] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  const getIssPosition = async () => {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544",
      { method: "GET" }
    );
    const data = await response.json();
    await console.log("GETTING ISS", data);
    setIssPosition({
      lat: data.latitude,
      lng: data.longitude,
    });
    return { latitude: data.latitude, longitude: data.longitude };
  };

  const issQuery = useQuery({
    queryKey: ["issPosition"],
    queryFn: async () => {
      const issData = await getIssPosition();
      return { latitude: issData.latitude, longitude: issData.longitude };
    },
    refetchInterval: isRefetching ? 6000 : false,
  });

  const locateUser = async () => {
    console.log("Locate User from Page", issQuery);
    if (issQuery.data) {
      setIssPosition({
        lat: issQuery.data.latitude,
        lng: issQuery.data.longitude,
      });
      setIsRefetching(!isRefetching);
      setIsTrackingIss(!isTrackingIss);
    }
  };
  // const trailUser = async () => {
  //   console.log("Follow User from Page", issQuery);
  //   if (issQuery.data) {
  //     setIssPosition({
  //       lat: issQuery.data.latitude,
  //       lng: issQuery.data.longitude,
  //     });
  //   }
  //   // ^This needs to draw line as call is made
  // };

  const memberList: MemberListItem[] = [
    { name: "Cindy", team: "Bravo" },
    { name: "Ellie", team: "Alpha" },
  ];
  return (
    <div>
      <MemberList list={memberList} />
      <ActionButtons
        selectedUserPositionHandler={locateUser}
        isTracking={isTrackingIss}
      />
      <Map
        issPosition={issPosition}
        isRefetching={isRefetching}
        isTrackingIss={isTrackingIss}
      />
    </div>
  );
}
