"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function RowControls({
  isActive,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  itemLabel = "item ini",
}: {
  isActive: boolean;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  itemLabel?: string;
}) {
  function handleDelete() {
    if (
      window.confirm(`Hapus ${itemLabel}? Tindakan ini tidak bisa dibatalkan.`)
    ) {
      onDelete();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="neutral"
        size="sm"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        aria-label="Naikkan urutan"
      >
        ▲
      </Button>
      <Button
        type="button"
        variant="neutral"
        size="sm"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        aria-label="Turunkan urutan"
      >
        ▼
      </Button>
      <label className="flex items-center gap-2 text-sm font-heading text-foreground">
        <Switch checked={isActive} onCheckedChange={onToggleActive} />
        {isActive ? "Aktif" : "Nonaktif"}
      </label>
      <Button
        type="button"
        variant="neutral"
        size="sm"
        onClick={handleDelete}
        aria-label="Hapus"
        className="ml-auto bg-destructive text-destructive-foreground"
      >
        Hapus
      </Button>
    </div>
  );
}
