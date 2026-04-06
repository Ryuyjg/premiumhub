"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [submitting, setSubmitting] = useState(false);

  async function createCategory(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        name: String(formData.get("name")),
        description: String(formData.get("description"))
      };

      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to create category.");
      }

      toast.success("Category created.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Category creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="h-full">
      <h2 className="text-xl font-semibold">Category management</h2>
      <p className="mt-1 text-sm text-muted-foreground">Create categories with name and description.</p>
      <form action={createCategory} className="mt-5 grid gap-4">
        <Input name="name" placeholder="Movies and Entertainment" required />
        <textarea
          name="description"
          placeholder="Category description"
          className="min-h-24 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
        />
        <Button disabled={submitting}>{submitting ? "Saving..." : "Create category"}</Button>
      </form>
      <div className="mt-6 grid gap-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-border/80 px-4 py-3">
            <p className="font-semibold">{category.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{category.description || "No description added."}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
