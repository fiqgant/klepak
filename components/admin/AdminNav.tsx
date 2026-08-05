"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface AdminNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export default function AdminNav({
  items,
  allOpen,
  onJump,
  onToggleAll,
}: {
  items: AdminNavItem[];
  allOpen: boolean;
  onJump: (id: string) => void;
  onToggleAll: () => void;
}) {
  function handleJump(id: string) {
    onJump(id);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  return (
    <nav className="border-b-2 border-border bg-background px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center gap-2 overflow-x-auto">
        <div className="flex flex-1 items-center gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleJump(item.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-base border-2 border-border bg-secondary-background px-3 py-1.5 text-xs font-heading uppercase tracking-wide text-foreground shadow-shadow transition-transform hover:-translate-y-0.5"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="neutral"
          size="sm"
          onClick={onToggleAll}
          className="shrink-0"
        >
          {allOpen ? "Tutup semua" : "Buka semua"}
        </Button>
      </div>
    </nav>
  );
}
