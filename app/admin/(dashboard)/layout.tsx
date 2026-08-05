"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  QrCode,
  Settings as SettingsIcon,
  Video as VideoIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import EmergencyBanner from "@/components/admin/EmergencyBanner";
import AdminNav, { type AdminNavItem } from "@/components/admin/AdminNav";

const NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: <LayoutDashboard size={14} /> },
  {
    href: "/admin/pengumuman",
    label: "Pengumuman",
    icon: <Megaphone size={14} />,
  },
  { href: "/admin/poster", label: "Poster", icon: <ImageIcon size={14} /> },
  {
    href: "/admin/jadwal",
    label: "Jadwal",
    icon: <CalendarClock size={14} />,
  },
  { href: "/admin/qr", label: "QR", icon: <QrCode size={14} /> },
  { href: "/admin/video", label: "Video", icon: <VideoIcon size={14} /> },
  {
    href: "/admin/pengaturan",
    label: "Pengaturan",
    icon: <SettingsIcon size={14} />,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

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
        <AdminNav items={NAV_ITEMS} />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <EmergencyBanner />
        {children}
      </div>
    </main>
  );
}
