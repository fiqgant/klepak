"use client";

import { useState, type FormEvent } from "react";
import { Video as VideoIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useAdminTable } from "@/lib/useAdminTable";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/date";
import type { Video, VideoSourceType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RowControls from "./RowControls";
import Section from "./Section";

const selectClass =
  "flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

async function uploadVideoFile(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "mp4";
  const path = `videos/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("signage-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return supabase.storage.from("signage-images").getPublicUrl(path).data
    .publicUrl;
}

function AddForm({ onAdd }: { onAdd: (row: Partial<Video>) => void }) {
  const [sourceType, setSourceType] = useState<VideoSourceType>("youtube");
  const [sourceValue, setSourceValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (sourceType === "youtube" && !sourceValue.trim()) return;
    if (sourceType === "upload" && !file) return;

    setUploading(true);
    try {
      const value =
        sourceType === "youtube"
          ? sourceValue.trim()
          : await uploadVideoFile(file as File);

      onAdd({
        source_type: sourceType,
        source_value: value,
        caption: caption.trim() || null,
        starts_at: fromDatetimeLocalValue(startsAt) ?? new Date().toISOString(),
        ends_at: fromDatetimeLocalValue(endsAt),
        is_active: true,
      });
      setSourceValue("");
      setFile(null);
      setCaption("");
      setStartsAt("");
      setEndsAt("");
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
      <select
        value={sourceType}
        onChange={(e) => setSourceType(e.target.value as VideoSourceType)}
        className={selectClass}
      >
        <option value="youtube">YouTube</option>
        <option value="upload">Unggah file</option>
      </select>

      {sourceType === "youtube" ? (
        <Input
          type="text"
          placeholder="ID atau URL video YouTube"
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
        />
      ) : (
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="rounded-base border-2 border-border bg-secondary-background p-2 text-sm font-base text-foreground"
        />
      )}

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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={uploading}>
        {uploading ? "Mengunggah..." : "Tambah video"}
      </Button>
    </form>
  );
}

function Row({
  row,
  onSave,
  controls,
}: {
  row: Video;
  onSave: (patch: Partial<Video>) => void;
  controls: React.ReactNode;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave({
      caption: String(form.get("caption") ?? "").trim() || null,
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
      <p className="text-xs font-heading uppercase tracking-wide text-foreground/60">
        {row.source_type} — {row.source_value}
      </p>
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="submit" variant="neutral" size="sm">
          Simpan
        </Button>
        {controls}
      </div>
    </form>
  );
}

export default function VideosSection({
  alwaysOpen,
}: { alwaysOpen?: boolean } = {}) {
  const { rows, loading, error, add, update, remove, toggleActive, move } =
    useAdminTable<Video>("videos");

  return (
    <Section
      id="video"
      title="Video"
      icon={<VideoIcon size={18} />}
      badge="Eksperimental"
      alwaysOpen={alwaysOpen}
    >
      <p className="mb-3 rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base text-foreground">
        Fitur eksperimental — chipset TV/STB lama sering kesulitan memutar
        video dengan lancar. Gunakan poster gambar jika memungkinkan.
      </p>
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
              itemLabel="video ini"
            />
          }
        />
      ))}
    </Section>
  );
}
