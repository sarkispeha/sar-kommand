import Link from "next/link";

const Nav = () => {
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/headquarters", label: "HQ" },
    { href: "/hq-map", label: "Map" },
    { href: "/file-upload", label: "File Upload" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex justify-center items-center gap-8 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="flex flex-col lg:hidden p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-lg text-gray-700 hover:text-blue-600 py-3 border-b border-gray-100 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;
