"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, LayoutDashboard, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/dogs", label: "犬隻管理", icon: PawPrint },
  { href: "/expenses", label: "花費統計", icon: DollarSign },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <PawPrint className="h-6 w-6 text-primary" />
          Pawson
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
