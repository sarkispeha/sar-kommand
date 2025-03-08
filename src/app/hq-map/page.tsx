"use client";

import Map from "@/components/Map/MapboxMap";
import MemberList from "@/components/Map/MemberList";
import { MemberListItem } from "@/data/Member";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MemberData } from "@/data/Member";
import { useUpdateMemberCoordinates } from "@/utils/hooks/useUpdateMemberCoordinates";

export default function HqMapPage() {
  const [selectedMembers, setSelectedMembers] = useState<MemberData[]>([]);

  const selectedMemberIds = useMemo(
    () => selectedMembers.map((member) => member.sarMemberId),
    [selectedMembers]
  );

  // Get coordinate updates every 5 seconds
  const memberPositions = useUpdateMemberCoordinates(selectedMemberIds);

  // Combine selected members with their latest positions
  const membersWithUpdatedPositions = useMemo(() => {
    return selectedMembers.map((member) => {
      // If we have updated coordinates for this member, use them
      if (memberPositions[member.sarMemberId]) {
        return {
          ...member,
          position: memberPositions[member.sarMemberId],
        };
      }
      // Otherwise return the member as is
      return member;
    });
  }, [selectedMembers, memberPositions]);

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
      <Map selectedMembers={membersWithUpdatedPositions} />
    </div>
  );
}
