import { MemberData } from "@/data/Member";
import { Marker } from "react-map-gl";

interface MemberMarkerProps {
  selectedMember: MemberData;
}
export function MemberMarker({ selectedMember }: MemberMarkerProps) {
  return (
    <Marker
      key={selectedMember.sarMemberId}
      longitude={selectedMember.position!.lng}
      latitude={selectedMember.position!.lat}
      // color="blue"
      anchor="bottom"
    >
      <div className="flex flex-col items-center">
        <p className="bg-white bg-opacity-70 px-2 py-1 rounded shadow mb-1 text-sm">
          {selectedMember.name}
        </p>
        {/* TODO: make better icon than this half-assed marker icon */}
        <div className="w-5 h-5 rounded-full bg-blue-500" />{" "}
      </div>
    </Marker>
  );
}
