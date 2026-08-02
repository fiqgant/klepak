"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";

interface AdminRow {
  id: string;
  sort_order: number;
  is_active: boolean;
}

// Shared CRUD + reorder + realtime logic for the admin panel's six content
// tables — they all follow the same shape (id, sort_order, is_active) and
// the same list-editor UX (add, edit, toggle, move up/down, delete).
export function useAdminTable<T extends AdminRow>(table: string) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
      setRows((data as T[]) ?? []);
    }
    setLoading(false);
  }, [supabase, table]);

  useEffect(() => {
    refetch();

    const channel = supabase
      .channel(`admin-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        refetch
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, table, refetch]);

  async function add(row: Partial<T>) {
    const nextSortOrder =
      rows.length > 0 ? Math.max(...rows.map((r) => r.sort_order)) + 1 : 0;
    const { error: insertError } = await supabase
      .from(table)
      .insert({ sort_order: nextSortOrder, ...row } as never);
    if (insertError) throw insertError;
    await refetch();
  }

  async function update(id: string, patch: Partial<T>) {
    const { error: updateError } = await supabase
      .from(table)
      .update(patch as never)
      .eq("id", id);
    if (updateError) throw updateError;
    await refetch();
  }

  async function remove(id: string) {
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq("id", id);
    if (deleteError) throw deleteError;
    await refetch();
  }

  async function toggleActive(row: T) {
    await update(row.id, { is_active: !row.is_active } as Partial<T>);
  }

  async function move(row: T, direction: "up" | "down") {
    const sorted = [...rows].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((r) => r.id === row.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;

    const neighbor = sorted[swapIndex];
    const rowOrder = row.sort_order;
    const neighborOrder = neighbor.sort_order;

    await Promise.all([
      supabase
        .from(table)
        .update({ sort_order: neighborOrder } as never)
        .eq("id", row.id),
      supabase
        .from(table)
        .update({ sort_order: rowOrder } as never)
        .eq("id", neighbor.id),
    ]);
    await refetch();
  }

  return { rows, loading, error, add, update, remove, toggleActive, move };
}
