"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export default function Section({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-base border-2 border-border bg-secondary-background shadow-shadow">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="font-heading text-lg uppercase tracking-wide text-foreground">
            {title}
          </span>
          {badge && <Badge>{badge}</Badge>}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-base border-2 border-border bg-background text-lg font-heading text-foreground">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t-2 border-border px-4 py-4">{children}</div>
      )}
    </section>
  );
}
