import { Button } from "@nextui-org/react";
import { db } from "@/db";

const HeadquartersPage = async () => {
  const snippets = await db.snippet.findMany();
  const memberCoord = await db.memberCoord.findMany();
  return (
    <div>
      HeadQuarters
      <div>
        {memberCoord.map((coord) => {
          return <p>{`lat: ${coord.lat}, lng: ${coord.lng}`}</p>;
        })}
      </div>
      <Button>FIND PERSON</Button>
    </div>
  );
};

export default HeadquartersPage;
