"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import EmergencyBanner from "@/components/admin/EmergencyBanner";
import AnnouncementsSection from "@/components/admin/AnnouncementsSection";
import PostersSection from "@/components/admin/PostersSection";
import ScheduleSection from "@/components/admin/ScheduleSection";
import QrLinksSection from "@/components/admin/QrLinksSection";
import VideosSection from "@/components/admin/VideosSection";
import SettingsSection from "@/components/admin/SettingsSection";

export default function AdminPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-border bg-main px-4 py-3 shadow-shadow">
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

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <EmergencyBanner />
        <AnnouncementsSection />
        <PostersSection />
        <ScheduleSection />
        <QrLinksSection />
        <VideosSection />
        <SettingsSection />
      </div>
    </main>
  );
}
