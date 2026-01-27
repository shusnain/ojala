"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText } from "lucide-react";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Invoices", href: "/invoices", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Ojala
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
