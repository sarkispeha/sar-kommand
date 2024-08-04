"use client";

import { useAppContext } from "@/context";
import { Button } from "@nextui-org/react";

const Homepage = () => {
  const { hello } = useAppContext();
  return (
    <div>
      <h1>Home Page {hello}</h1>
      <Button>TESTING</Button>
    </div>
  );
};
export default Homepage;
