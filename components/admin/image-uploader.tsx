"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export function ImageUploader({
  onUploaded
}: {
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Image upload failed.");
      }

      const data = await response.json();
      if (!data.url) throw new Error("No URL returned from server.");

      onUploaded(data.url);
      toast.success("Image successfully uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white px-5 py-2 text-sm font-semibold shadow-sm transition hover:bg-muted/50 dark:bg-white/5 ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={uploading} />
        <UploadCloud className="h-4 w-4" />
        {uploading ? "Uploading securely..." : "Upload image"}
      </label>
      <span className="text-xs text-muted-foreground">Via secure admin server</span>
    </div>
  );
}
