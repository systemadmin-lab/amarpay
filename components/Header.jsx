"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "My Events", path: "/my-event" },
    { name: "Create Event", path: "/create-event" },
  ];

  return (
    <header className="bg-black shadow-md border-b border-gray-800">
      <nav className="max-w-6xl mx-auto px-6 flex justify-center py-5">
        <ul className="flex gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`relative text-lg font-medium transition duration-300 ${
                  pathname === item.path
                    ? "text-amber-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
