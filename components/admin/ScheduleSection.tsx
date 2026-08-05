"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock } from "lucide-react";
import { useAdminTable } from "@/lib/useAdminTable";
import { todayLocalISODate } from "@/lib/date";
import type { ScheduleItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RowControls from "./RowControls";
import Section from "./Section";

function AddForm({ onAdd }: { onAdd: (row: Partial<ScheduleItem>) => void }) {
  const [eventDate, setEventDate] = useState(todayLocalISODate());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [pic, setPic] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startTime) return;
    onAdd({
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime || null,
      title: title.trim(),
      location: location.trim() || null,
      pic: pic.trim() || null,
      is_active: true,
    });
    setStartTime("");
    setEndTime("");
    setTitle("");
    setLocation("");
    setPic("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 rounded-base border-2 border-dashed border-border bg-background p-3"
    >
      <Input
        type="date"
        required
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />
      <div className="flex gap-2">
        <Input
          type="time"
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <Input
        type="text"
        required
        placeholder="Judul agenda"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Lokasi (opsional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        type="text"
        placeholder="PIC (opsional)"
        value={pic}
        onChange={(e) => setPic(e.target.value)}
      />
      <Button type="submit">Tambah jadwal</Button>
    </form>
  );
}

function Row({
  row,
  onSave,
  controls,
}: {
  row: ScheduleItem;
  onSave: (patch: Partial<ScheduleItem>) => void;
  controls: React.ReactNode;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave({
      event_date: String(form.get("event_date") ?? row.event_date),
      start_time: String(form.get("start_time") ?? row.start_time),
      end_time: String(form.get("end_time") ?? "") || null,
      title: String(form.get("title") ?? ""),
      location: String(form.get("location") ?? "").trim() || null,
      pic: String(form.get("pic") ?? "").trim() || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b-2 border-border py-4 last:border-none"
    >
      <Input type="date" name="event_date" defaultValue={row.event_date} />
      <div className="flex gap-2">
        <Input
          type="time"
          name="start_time"
          defaultValue={row.start_time.slice(0, 5)}
        />
        <Input
          type="time"
          name="end_time"
          defaultValue={row.end_time?.slice(0, 5) ?? ""}
        />
      </div>
      <Input name="title" defaultValue={row.title} />
      <Input
        name="location"
        defaultValue={row.location ?? ""}
        placeholder="Lokasi"
      />
      <Input name="pic" defaultValue={row.pic ?? ""} placeholder="PIC" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button type="submit" variant="neutral" size="sm">
          Simpan
        </Button>
        {controls}
      </div>
    </form>
  );
}

export default function ScheduleSection({
  alwaysOpen,
}: { alwaysOpen?: boolean } = {}) {
  const { rows, loading, error, add, update, remove, toggleActive, move } =
    useAdminTable<ScheduleItem>("schedule_items");

  return (
    <Section
      id="jadwal"
      title="Jadwal"
      icon={<CalendarClock size={18} />}
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
              itemLabel="jadwal ini"
            />
          }
        />
      ))}
    </Section>
  );
}
