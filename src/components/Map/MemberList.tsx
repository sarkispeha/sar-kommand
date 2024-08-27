import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { MemberListItem } from "@/data/Member";

interface MemberListProps {
  list: MemberListItem[];
}

const MemberList = ({ list }: MemberListProps) => {
  return (
    <CheckboxGroup label="Select members" defaultValue={[]}>
      {list.map((person) => (
        <Checkbox value={person.name} key={person.name}>
          {person.name} ({person.team})
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default MemberList;
