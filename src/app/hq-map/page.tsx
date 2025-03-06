"use client";

import Map from "@/components/Map/MapboxMap";
import MemberList from "@/components/Map/MemberList";
import { MemberListItem } from "@/data/Member";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MemberData } from "@/data/Member";
import { useMemberCoordinates } from "@/utils/hooks/useMemberCoordinates";

export default function HqMapPage() {
  const [selectedMembers, setSelectedMembers] = useState<MemberData[]>([]);

  const mobileMemberPosition = useMemberCoordinates();

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
      <Map selectedMembers={selectedMembers} />
    </div>
  );
}
