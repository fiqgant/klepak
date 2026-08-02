"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase";
import { useAdminTable } from "@/lib/useAdminTable";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/date";
import type { Poster } from "@/lib/types";
import { getPosterPublicUrl } from "@/components/display/PosterSlide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RowControls from "./RowControls";
import Section from "./Section";

async function uploadPosterFile(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `posters/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("signage-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return path;
}

function AddForm({ onAdd }: { onAdd: (row: Partial<Poster>) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [displaySeconds, setDisplaySeconds] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const path = await uploadPosterFile(file);
      onAdd({
        storage_path: path,
        caption: caption.trim() || null,
        starts_at: fromDatetimeLocalValue(startsAt) ?? new Date().toISOString(),
        ends_at: fromDatetimeLocalValue(endsAt),
        display_seconds: displaySeconds ? Number(displaySeconds) : null,
        is_active: true,
      });
      setFile(null);
      setCaption("");
      setStartsAt("");
      setEndsAt("");
      setDisplaySeconds("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-base border-2 border-dashed border-border bg-background p-3"
    >
      <input
        type="file"
        accept="image/*"
        required
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="rounded-base border-2 border-border bg-secondary-background p-2 text-sm font-base text-foreground"
      />
      <Input
        type="text"
        placeholder="Keterangan (opsional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
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
      <Input
        type="number"
        min={1}
        placeholder="Durasi tampil (detik, opsional — pakai default jika kosong)"
        value={displaySeconds}
        onChange={(e) => setDisplaySeconds(e.target.value)}
      />
      {error && (
        <p className="rounded-base border-2 border-border bg-destructive px-2 py-1 text-sm font-heading text-destructive-foreground">
          {error}
        </p>
      )}
      <Button type="submit" disabled={uploading}>
        {uploading ? "Mengunggah..." : "Tambah poster"}
      </Button>
    </form>
  );
}

function Row({
  row,
  onSave,
  controls,
}: {
  row: Poster;
  onSave: (patch: Partial<Poster>) => void;
  controls: React.ReactNode;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const displaySeconds = String(form.get("display_seconds") ?? "");
    onSave({
      caption: String(form.get("caption") ?? "").trim() || null,
      starts_at:
        fromDatetimeLocalValue(String(form.get("starts_at") ?? "")) ??
        row.starts_at,
      ends_at: fromDatetimeLocalValue(String(form.get("ends_at") ?? "")),
      display_seconds: displaySeconds ? Number(displaySeconds) : null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b-2 border-border py-4 last:border-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getPosterPublicUrl(row.storage_path)}
        alt={row.caption ?? ""}
        className="h-32 w-full rounded-base border-2 border-border object-cover"
      />
      <Input
        name="caption"
        defaultValue={row.caption ?? ""}
        placeholder="Keterangan"
      />
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
      <Input
        type="number"
        min={1}
        name="display_seconds"
        defaultValue={row.display_seconds ?? ""}
        placeholder="Durasi tampil (detik)"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="submit" variant="neutral" size="sm">
          Simpan
        </Button>
        {controls}
      </div>
    </form>
  );
}

export default function PostersSection() {
  const { rows, loading, error, add, update, remove, toggleActive, move } =
    useAdminTable<Poster>("posters");

  return (
    <Section title="Poster" badge={`${rows.length}`}>
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
