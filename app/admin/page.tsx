"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CalendarClock,
  Image as ImageIcon,
  Megaphone,
  QrCode,
  Settings as SettingsIcon,
  Video as VideoIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import EmergencyBanner from "@/components/admin/EmergencyBanner";
import AnnouncementsSection from "@/components/admin/AnnouncementsSection";
import PostersSection from "@/components/admin/PostersSection";
import ScheduleSection from "@/components/admin/ScheduleSection";
import QrLinksSection from "@/components/admin/QrLinksSection";
import VideosSection from "@/components/admin/VideosSection";
import SettingsSection from "@/components/admin/SettingsSection";
import AdminNav, { type AdminNavItem } from "@/components/admin/AdminNav";

const SECTION_IDS = [
  "pengumuman",
  "poster",
  "jadwal",
  "qr-tautan",
  "video",
  "pengaturan",
] as const;

const NAV_ITEMS: AdminNavItem[] = [
  { id: "darurat", label: "Darurat", icon: <AlertTriangle size={14} /> },
  { id: "pengumuman", label: "Pengumuman", icon: <Megaphone size={14} /> },
  { id: "poster", label: "Poster", icon: <ImageIcon size={14} /> },
  { id: "jadwal", label: "Jadwal", icon: <CalendarClock size={14} /> },
  { id: "qr-tautan", label: "QR", icon: <QrCode size={14} /> },
  { id: "video", label: "Video", icon: <VideoIcon size={14} /> },
  { id: "pengaturan", label: "Pengaturan", icon: <SettingsIcon size={14} /> },
];

export default function AdminPage() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SECTION_IDS.map((id) => [id, false]))
  );

  const allOpen = SECTION_IDS.every((id) => openSections[id]);

  function setSectionOpen(id: string, open: boolean) {
    setOpenSections((prev) => ({ ...prev, [id]: open }));
  }

  function handleToggleAll() {
    const next = !allOpen;
    setOpenSections(Object.fromEntries(SECTION_IDS.map((id) => [id, next])));
  }

  function handleJump(id: string) {
    if (id !== "darurat") setSectionOpen(id, true);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-10">
        <header className="flex items-center justify-between border-b-2 border-border bg-main px-4 py-3 shadow-shadow">
          <h1 className="font-heading text-lg uppercase tracking-wide text-main-foreground">
            Klepak Admin
          </h1>
          <Button
            type="button"
            variant="neutral"
            size="sm"
            onClick={handleLogout}
          >
            Keluar
          </Button>
        </header>
        <AdminNav
          items={NAV_ITEMS}
          allOpen={allOpen}
          onJump={handleJump}
          onToggleAll={handleToggleAll}
        />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <div id="darurat" className="scroll-mt-28">
          <EmergencyBanner />
        </div>
        <AnnouncementsSection
          open={openSections["pengumuman"]}
          onOpenChange={(open) => setSectionOpen("pengumuman", open)}
        />
        <PostersSection
          open={openSections["poster"]}
          onOpenChange={(open) => setSectionOpen("poster", open)}
        />
        <ScheduleSection
          open={openSections["jadwal"]}
          onOpenChange={(open) => setSectionOpen("jadwal", open)}
        />
        <QrLinksSection
          open={openSections["qr-tautan"]}
          onOpenChange={(open) => setSectionOpen("qr-tautan", open)}
        />
        <VideosSection
          open={openSections["video"]}
          onOpenChange={(open) => setSectionOpen("video", open)}
        />
        <SettingsSection
          open={openSections["pengaturan"]}
          onOpenChange={(open) => setSectionOpen("pengaturan", open)}
        />
      </div>
    </main>
  );
}
