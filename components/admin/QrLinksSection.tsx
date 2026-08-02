"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { useAdminTable } from "@/lib/useAdminTable";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/date";
import type { QrLink } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RowControls from "./RowControls";
import Section from "./Section";

function QrPreview({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 140,
      margin: 1,
      color: { dark: "#16130f", light: "#ffffff" },
    }).catch(() => {
      // Invalid URL — canvas just stays blank/stale.
    });
  }, [url]);

  if (!url) return null;
  return (
    <canvas
      ref={canvasRef}
      className="rounded-base border-2 border-border bg-secondary-background p-2"
    />
  );
}

function AddForm({ onAdd }: { onAdd: (row: Partial<QrLink>) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({
      title: title.trim(),
      url: url.trim(),
      starts_at: fromDatetimeLocalValue(startsAt) ?? new Date().toISOString(),
      ends_at: fromDatetimeLocalValue(endsAt),
      is_active: true,
    });
    setTitle("");
    setUrl("");
    setStartsAt("");
    setEndsAt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-base border-2 border-dashed border-border bg-background p-3"
    >
      <Input
        type="text"
        required
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="url"
        required
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <QrPreview url={url} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
        />
      </div>
      <Button type="submit">Tambah tautan</Button>
    </form>
  );
}

function Row({
  row,
  onSave,
  controls,
}: {
  row: QrLink;
  onSave: (patch: Partial<QrLink>) => void;
  controls: React.ReactNode;
}) {
  const [url, setUrl] = useState(row.url);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave({
      title: String(form.get("title") ?? ""),
      url: String(form.get("url") ?? row.url),
      starts_at:
        fromDatetimeLocalValue(String(form.get("starts_at") ?? "")) ??
        row.starts_at,
      ends_at: fromDatetimeLocalValue(String(form.get("ends_at") ?? "")),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b-2 border-border py-4 last:border-none"
    >
      <Input name="title" defaultValue={row.title} />
      <Input
        type="url"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <QrPreview url={url} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="datetime-local"
          name="starts_at"
          defaultValue={toDatetimeLocalValue(row.starts_at)}
        />
        <Input
          type="datetime-local"
          name="ends_at"
          defaultValue={toDatetimeLocalValue(row.ends_at)}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="submit" variant="neutral" size="sm">
          Simpan
        </Button>
        {controls}
      </div>
    </form>
  );
}

export default function QrLinksSection() {
  const { rows, loading, error, add, update, remove, toggleActive, move } =
    useAdminTable<QrLink>("qr_links");

  return (
    <Section title="QR / Tautan" badge={`${rows.length}`}>
      <AddForm onAdd={add} />
      {loading && <p className="text-sm text-foreground/50">Memuat...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {rows.map((row, i) => (
        <Row
          key={row.id}
          row={row}
          onSave={(patch) => update(row.id, patch)}
          controls={
            <RowControls
              isActive={row.is_active}
              onToggleActive={() => toggleActive(row)}
              onMoveUp={() => move(row, "up")}
              onMoveDown={() => move(row, "down")}
              onDelete={() => remove(row.id)}
              canMoveUp={i > 0}
              canMoveDown={i < rows.length - 1}
            />
          }
        />
      ))}
    </Section>
  );
}
