"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Yes",
  cancelLabel = "No",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/48 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[1.75rem] border border-border/80 bg-background p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
              tone === "danger" ? "bg-rose-500/12 text-rose-600" : "bg-primary/10 text-primary"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
