"use client";

import { useAppContext } from "@/context";

const Homepage = () => {
  const { hello } = useAppContext();
  return <div>Home Page {hello}</div>;
};
export default Homepage;
