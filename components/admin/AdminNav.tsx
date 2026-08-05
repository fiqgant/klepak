"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export default function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="border-b-2 border-border bg-background px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center gap-2 overflow-x-auto">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-base border-2 border-border px-3 py-1.5 text-xs font-heading uppercase tracking-wide shadow-shadow transition-transform hover:-translate-y-0.5 ${
                active
                  ? "bg-main text-main-foreground"
                  : "bg-secondary-background text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
