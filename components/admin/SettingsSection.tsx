"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase";
import type { Settings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "./Section";

export default function SettingsSection() {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [seconds, setSeconds] = useState("8");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setSettings(data);
        setSeconds(String(data.poster_default_seconds));
      }
    }
    load();
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase
      .from("settings")
      .update({ poster_default_seconds: Number(seconds) })
      .eq("id", 1);
    setSaving(false);
    setSaved(true);
  }

  return (
    <Section title="Pengaturan">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Label>Durasi tampil poster default (detik)</Label>
        <Input
          type="number"
          min={1}
          value={seconds}
          onChange={(e) => {
            setSeconds(e.target.value);
            setSaved(false);
          }}
        />
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
        {saved && (
          <p className="text-sm text-foreground/70">Pengaturan tersimpan.</p>
        )}
        {!settings && (
          <p className="text-sm text-foreground/50">Memuat...</p>
        )}
      </form>
    </Section>
  );
}
