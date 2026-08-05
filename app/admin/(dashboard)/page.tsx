"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Image as ImageIcon,
  Megaphone,
  QrCode,
  Settings as SettingsIcon,
  Video as VideoIcon,
} from "lucide-react";

const CARDS: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    href: "/admin/pengumuman",
    title: "Pengumuman",
    description: "Kelola teks pengumuman berjalan di layar.",
    icon: <Megaphone size={22} />,
  },
  {
    href: "/admin/poster",
    title: "Poster",
    description: "Atur poster/gambar yang tampil bergiliran.",
    icon: <ImageIcon size={22} />,
  },
  {
    href: "/admin/jadwal",
    title: "Jadwal",
    description: "Atur jadwal acara atau kegiatan.",
    icon: <CalendarClock size={22} />,
  },
  {
    href: "/admin/qr",
    title: "QR / Tautan",
    description: "Kelola kode QR dan tautan yang ditampilkan.",
    icon: <QrCode size={22} />,
  },
  {
    href: "/admin/video",
    title: "Video",
    description: "Atur video yang diputar di layar (eksperimental).",
    icon: <VideoIcon size={22} />,
  },
  {
    href: "/admin/pengaturan",
    title: "Pengaturan",
    description: "Durasi poster, video/musik latar layar idle.",
    icon: <SettingsIcon size={22} />,
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-2xl uppercase tracking-wide text-foreground">
          Ringkasan
        </h2>
        <p className="text-sm text-foreground/60">
          Pilih menu di bawah untuk kelola konten layar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-start gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background text-foreground">
              {card.icon}
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-heading text-base uppercase tracking-wide text-foreground">
                {card.title}
              </span>
              <span className="text-sm text-foreground/60">
                {card.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
