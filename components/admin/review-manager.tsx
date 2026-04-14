"use client";

import { useMemo, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product, Review } from "@/types";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ReviewManager({ reviews, products }: { reviews: Review[]; products: Product[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter((review) =>
      `${review.name} ${review.message}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [reviews, query]);

  async function createReview(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        productId: String(formData.get("productId")),
        name: String(formData.get("name")),
        rating: Number(formData.get("rating")),
        message: String(formData.get("message")),
        active: formData.get("active") === "on"
      };
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to create review.");
      }
      toast.success("Review created.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Review creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleReview(id: string, active: boolean) {
    const response = await fetch("/api/admin/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.error || "Unable to update review.");
      return;
    }
    toast.success(active ? "Review hidden." : "Review activated.");
    window.location.reload();
  }

  async function deleteReview(id: string) {
    const response = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.error(data.error || "Unable to delete review.");
      return;
    }
    toast.success("Review deleted.");
    setConfirmDelete(null);
    window.location.reload();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Review management</h2>
      <p className="mt-1 text-sm text-muted-foreground">Create trust-building reviews for product pages.</p>
      <form action={createReview} className="mt-4 grid gap-3">
        <select name="productId" className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5">
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Reviewer name" required />
          <Input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" required />
        </div>
        <textarea
          name="message"
          placeholder="Review message"
          className="min-h-20 rounded-[1.25rem] border border-border/80 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:bg-white/5"
          required
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input name="active" type="checkbox" defaultChecked />
          Active
        </label>
        <Button disabled={submitting}>{submitting ? "Saving..." : "Create review"}</Button>
      </form>

      <div className="mt-5">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews" />
      </div>
      <div className="mt-4 space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-2xl border border-border/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{review.name}</p>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={`${review.id}-${idx}`} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{review.message}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => toggleReview(review.id, review.active)}>
                {review.active ? "Hide" : "Activate"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(review)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 ? <p className="text-sm text-muted-foreground">No reviews found.</p> : null}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete review?"
        description={confirmDelete ? `Delete the review from "${confirmDelete.name}"?` : ""}
        confirmLabel="Yes, delete"
        cancelLabel="No"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            void deleteReview(confirmDelete.id);
          }
        }}
      />
    </Card>
  );
}
