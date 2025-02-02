// import { Button } from "@nextui-org/react";
import { CoordinatesList } from "@/components/CoordinatesList/CoordinatesList";
import { db } from "@/db";

const HeadquartersPage = async () => {
  // Can still do initial server-side data fetching if needed
  const initialCoordinates = await db.memberCoord.findMany({
    orderBy: { id: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1>HeadQuarters</h1>
      <CoordinatesList />
      {/* <Button>FIND PERSON</Button> */}
    </div>
  );
};

export default HeadquartersPage;
