import type { Announcement } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const PRIORITY_LABEL: Record<Announcement["priority"], string> = {
  darurat: "DARURAT",
  penting: "PENTING",
  normal: "INFO",
};

export default function AnnouncementsList({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-background px-8 py-12 sm:px-20">
      <h2 className="text-2xl font-heading uppercase tracking-wide text-foreground sm:text-4xl">
        Info Hari Ini
      </h2>
      <ul className="flex w-full max-w-4xl flex-col gap-4">
        {announcements.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-2 rounded-base border-2 border-border bg-secondary-background px-6 py-5 shadow-shadow sm:flex-row sm:items-center sm:gap-5"
          >
            <Badge
              variant={a.priority === "normal" ? "neutral" : "default"}
              className={
                a.priority === "darurat"
                  ? "bg-destructive text-destructive-foreground"
                  : undefined
              }
            >
              {PRIORITY_LABEL[a.priority]}
            </Badge>
            <span className="text-lg leading-snug text-foreground sm:text-2xl">
              {a.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
