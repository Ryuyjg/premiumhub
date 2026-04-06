"use client";

import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { getClientStorage } from "@/lib/firebase/client";

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
      const storage = getClientStorage();
      if (!storage) {
        throw new Error("Firebase storage config missing.");
      }

      const fileRef = ref(storage, `products/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file, {
        contentType: file.type
      });
      const url = await getDownloadURL(fileRef);
      onUploaded(url);
      toast.success("Image uploaded to Firebase Storage.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex cursor-pointer items-center">
        <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        <span className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
          {uploading ? "Uploading..." : "Upload image"}
        </span>
      </label>
      <span className="text-sm text-muted-foreground">Firebase Storage</span>
    </div>
  );
}
