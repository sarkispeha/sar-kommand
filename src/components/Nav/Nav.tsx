"use client";

import Link from "../../../node_modules/next/link";

const Nav = () => (
  <div>
    <Link href="/">Home</Link>
    <Link href="/headquarters">HQ</Link>
    <Link href="/hq-map">Map</Link>
  </div>
);

export default Nav;
