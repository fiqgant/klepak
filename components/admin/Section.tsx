"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export default function Section({
  id,
  title,
  icon,
  badge,
  defaultOpen = false,
  alwaysOpen = false,
  children,
}: {
  id?: string;
  title: string;
  icon?: ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  alwaysOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const headerContent = (
    <>
      <span className="flex items-center gap-2">
        {icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background text-foreground">
            {icon}
          </span>
        )}
        <span className="font-heading text-lg uppercase tracking-wide text-foreground">
          {title}
        </span>
        {badge && <Badge>{badge}</Badge>}
      </span>
      {!alwaysOpen && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background text-lg font-heading text-foreground">
          {open ? "−" : "+"}
        </span>
      )}
    </>
  );

  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-base border-2 border-border bg-secondary-background shadow-shadow"
    >
      {alwaysOpen ? (
        <div className="flex w-full items-center justify-between px-4 py-3 text-left">
          {headerContent}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          {headerContent}
        </button>
      )}
      {(alwaysOpen || open) && (
        <div className="border-t-2 border-border px-4 py-4">{children}</div>
      )}
    </section>
  );
}
