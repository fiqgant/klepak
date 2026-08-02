"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { EmergencyOverride } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function EmergencyBanner() {
  const supabase = useMemo(() => createClient(), []);
  const [row, setRow] = useState<EmergencyOverride | null>(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("emergency_override")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setRow(data);
        setText(data.text);
      }
    }
    load();

    const channel = supabase
      .channel("admin-emergency_override")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emergency_override" },
        load
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function save(nextIsActive: boolean) {
    setSaving(true);
    await supabase
      .from("emergency_override")
      .update({ is_active: nextIsActive, text })
      .eq("id", 1);
    setSaving(false);
  }

  const isActive = row?.is_active === true;

  return (
    <section
      className={`rounded-base border-2 border-border p-4 shadow-shadow ${
        isActive ? "bg-destructive" : "bg-secondary-background"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2
          className={`font-heading text-lg uppercase tracking-wide ${
            isActive ? "text-destructive-foreground" : "text-foreground"
          }`}
        >
          Mode Darurat
        </h2>
        <label className="flex items-center gap-2">
          <span
            className={`text-sm font-heading ${
              isActive ? "text-destructive-foreground" : "text-foreground"
            }`}
          >
            {isActive ? "AKTIF" : "Nonaktif"}
          </span>
          <Switch
            checked={isActive}
            disabled={saving}
            onCheckedChange={(checked) => save(checked)}
          />
        </label>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Teks yang akan ditampilkan penuh layar saat mode darurat aktif"
        rows={2}
        className="mb-3 bg-background"
      />
      <Button
        type="button"
        onClick={() => save(isActive)}
        disabled={saving}
        className="w-full bg-destructive text-destructive-foreground"
      >
        {saving ? "Menyimpan..." : "Simpan teks darurat"}
      </Button>
    </section>
  );
}
