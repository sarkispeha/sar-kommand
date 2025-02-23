import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { MemberListItem } from "@/data/Member";

interface MemberListProps {
  list: MemberListItem[];
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface MemberCheckboxProps {
  name: string;
  team: string;
  sarMemberId: number;
  onChangeHandler: MemberListProps["onChangeHandler"];
}

const MemberCheckbox = ({
  name,
  team,
  sarMemberId,
  onChangeHandler,
}: MemberCheckboxProps) => {
  return (
    <Checkbox
      onChange={(e) => onChangeHandler(e)}
      value={sarMemberId.toString()}
      key={`${name}${team}${sarMemberId}`}
    >
      {name} ({team})
    </Checkbox>
  );
};

const MemberList = ({ list, onChangeHandler }: MemberListProps) => {
  return (
    <CheckboxGroup label="Select members" defaultValue={[]} key={"members"}>
      {list.map((person) => (
        <MemberCheckbox
          key={person.sarMemberId}
          onChangeHandler={onChangeHandler}
          name={person.name}
          team={person.team}
          sarMemberId={person.sarMemberId}
        />
      ))}
    </CheckboxGroup>
  );
};

export default MemberList;
