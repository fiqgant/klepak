"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import type { QrLink } from "@/lib/types";

export default function QrSlide({ link }: { link: QrLink }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, link.url, {
      width: 400,
      margin: 1,
      color: { dark: "#16130f", light: "#ffffff" },
    }).catch(() => {
      // Swallowed: an invalid/unreachable URL just means an empty canvas
      // stays blank instead of crashing the slideshow.
    });
  }, [link.url]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-background px-8">
      <canvas
        ref={canvasRef}
        className="rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow"
      />
      <div className="text-center">
        <p className="text-2xl font-heading text-foreground sm:text-4xl">
          {link.title}
        </p>
        <p className="mt-2 break-all text-base text-foreground/60">
          {link.url}
        </p>
      </div>
    </div>
  );
}
