"use client";

import { useState, type FormEvent } from "react";
import { Megaphone } from "lucide-react";
import { useAdminTable } from "@/lib/useAdminTable";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/date";
import type { Announcement, Priority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RowControls from "./RowControls";
import Section from "./Section";

const PRIORITIES: Priority[] = ["normal", "penting", "darurat"];

const selectClass =
  "flex h-10 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

function AddForm({ onAdd }: { onAdd: (row: Partial<Announcement>) => void }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({
      text: text.trim(),
      priority,
      starts_at: fromDatetimeLocalValue(startsAt) ?? new Date().toISOString(),
      ends_at: fromDatetimeLocalValue(endsAt),
      is_active: true,
    });
    setText("");
    setPriority("normal");
    setStartsAt("");
    setEndsAt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-base border-2 border-dashed border-border bg-background p-3"
    >
      <Textarea
        required
        placeholder="Teks pengumuman"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className={selectClass}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
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
          placeholder="Tanpa batas akhir"
        />
      </div>
      <Button type="submit">Tambah pengumuman</Button>
    </form>
  );
}

function Row({
  row,
  onSave,
  controls,
}: {
  row: Announcement;
  onSave: (patch: Partial<Announcement>) => void;
  controls: React.ReactNode;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave({
      text: String(form.get("text") ?? ""),
      priority: form.get("priority") as Priority,
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
      <Textarea name="text" defaultValue={row.text} rows={2} />
      <select
        name="priority"
        defaultValue={row.priority}
        className={selectClass}
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
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

export default function AnnouncementsSection({
  alwaysOpen,
}: { alwaysOpen?: boolean } = {}) {
  const { rows, loading, error, add, update, remove, toggleActive, move } =
    useAdminTable<Announcement>("announcements");

  return (
    <Section
      id="pengumuman"
      title="Pengumuman"
      icon={<Megaphone size={18} />}
      badge={`${rows.length}`}
      alwaysOpen={alwaysOpen}
    >
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
              itemLabel="pengumuman ini"
            />
          }
        />
      ))}
    </Section>
  );
}
