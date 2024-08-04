import Link from "next/link";
import { Button } from "@nextui-org/react";

const Nav = () => (
  <div>
    <Button>
      <Link href="/">Home</Link>
    </Button>
    <Button>
      <Link href="/headquarters">HQ</Link>
    </Button>
    <Button>
      <Link href="/hq-map">Map</Link>
    </Button>
  </div>
);

export default Nav;
