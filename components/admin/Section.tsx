"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export default function Section({
  id,
  title,
  icon,
  badge,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
}: {
  id?: string;
  title: string;
  icon?: ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;

  function toggle() {
    const next = !open;
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setOpenState(next);
    }
  }

  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-base border-2 border-border bg-secondary-background shadow-shadow"
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
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
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background text-lg font-heading text-foreground">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t-2 border-border px-4 py-4">{children}</div>
      )}
    </section>
  );
}
