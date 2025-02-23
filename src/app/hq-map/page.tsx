"use client";

import Map from "@/components/Map/MapboxMap";
import ActionButtons from "@/components/Map/MapActionButtons";
import MemberList from "@/components/Map/MemberList";
import { MemberListItem } from "@/data/Member";
import { useQuery } from "@tanstack/react-query";
// import useFetch from "@/utils/hooks/useFetch";
import { useState } from "react";
import type { Position } from "geojson";
import { GeoJsonPosition } from "@/data/Geo";
import { MemberData } from "@/data/Member";

export default function HqMapPage() {
  const [issPosition, setIssPosition] = useState<GeoJsonPosition | null>(null);
  const [isTrackingIss, setIsTrackingIss] = useState<boolean>(false);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [isTrailing, setIsTrailing] = useState<boolean>(false);
  const [trailingArray, setTrailingArray] = useState<Position[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<MemberData[]>([]);

  const getIssPosition = async () => {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544",
      { method: "GET" }
    );
    const data: { latitude: number; longitude: number } = await response.json();
    // await console.log("GETTING ISS", data);
    setIssPosition({
      // TODO, this shouldn't be called here, set in handlers
      lat: data.latitude,
      lng: data.longitude,
    });
    setTrailingArray([...trailingArray, [data.longitude, data.latitude]]);
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
  const trailUser = async () => {
    console.log("Trail User from Page");
    if (issQuery.data) {
      const {
        data: { longitude: lng, latitude: lat },
      } = issQuery;
      // setIssPosition({
      //   lat: data.latitude,
      //   lng: data.longitude,
      // });
      setIsTrailing(!isTrailing);
      setIsRefetching(!isRefetching);
      const newPosition: Position = [lng, lat];

      // console.log("NEW POSITION", newPosition);
      // console.log("TRAILING ARRAY", trailingArray);
      setTrailingArray([...trailingArray, newPosition]);
    }
    // ^This needs to draw line as call is made
  };

  // TODO; abstract out the members query with hook
  const membersQuery = useQuery<MemberData[]>({
    queryKey: ["sarMembers"],
    queryFn: async () => {
      const response = await fetch("/api/members");
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      return response.json();
    },
  });

  // Transform the data to match MemberListItem interface
  const memberListItems: MemberListItem[] =
    membersQuery.data?.map((member) => ({
      name: member.name,
      team: member.team,
      sarMemberId: member.sarMemberId,
    })) || [];
  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      // Add member if checked
      const checkedMemberData = membersQuery.data?.find(
        (member) => member.sarMemberId === targetValue
      );
      if (checkedMemberData) {
        setSelectedMembers((prev) => [...prev, checkedMemberData]);
      }
    } else {
      // Remove member if unchecked
      setSelectedMembers((prevSelectedMembers) =>
        prevSelectedMembers.filter(
          (member) => member.sarMemberId !== targetValue
        )
      );
    }
  };

  return (
    <div>
      <MemberList
        onChangeHandler={handleCheckboxClick}
        list={memberListItems}
      />
      <ActionButtons
        selectedUserPositionHandler={locateUser}
        isTracking={isTrackingIss}
        selectedUserTrackHandler={trailUser}
      />
      <Map
        issPosition={issPosition}
        isRefetching={isRefetching}
        isTrackingIss={isTrackingIss}
        isTrailing={isTrailing}
        trailingArray={trailingArray}
        selectedMembers={selectedMembers}
      />
    </div>
  );
}
