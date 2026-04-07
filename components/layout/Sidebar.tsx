"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, LayoutDashboard, DollarSign, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/actions/auth";

const navItems = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/pets", label: "寵物管理", icon: PawPrint },
  { href: "/expenses", label: "花費統計", icon: DollarSign },
  { href: "/community", label: "共同討論區", icon: MessageSquare },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-card border-r flex-col">
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
      <div className="p-3 border-t">
        <div className="px-3 py-1.5 text-xs text-muted-foreground truncate mb-1">
          {userName ?? "使用者"}
        </div>
        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            登出
          </button>
        </form>
      </div>
    </aside>
  );
}

export function MobileNav({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex items-stretch">
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
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 px-1 text-xs font-medium transition-colors",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
