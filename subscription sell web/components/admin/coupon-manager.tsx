"use client";

import { useMemo, useState } from "react";
import { Percent, Ticket } from "lucide-react";
import { toast } from "sonner";
import type { Coupon } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const [submitting, setSubmitting] = useState(false);

  const activeCoupons = useMemo(() => coupons.filter((coupon) => coupon.active), [coupons]);

  async function createCoupon(formData: FormData) {
    setSubmitting(true);
    try {
      const payload = {
        code: String(formData.get("code")),
        type: String(formData.get("type")),
        value: Number(formData.get("value")),
        usageLimit: Number(formData.get("usageLimit")),
        expiresAt: new Date(String(formData.get("expiresAt"))).toISOString(),
        active: formData.get("active") === "on"
      };

      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Unable to create coupon.");
      }

      toast.success("Coupon created. Refresh to see it in the list.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Coupon creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Discount engine</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{activeCoupons.length} active</p>
      </div>
      <form action={createCoupon} className="mt-5 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="code" placeholder="WELCOME20" required />
          <select name="type" className="h-11 rounded-2xl border border-border/80 bg-white/80 px-4 text-sm dark:bg-white/5">
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
          <Input name="value" type="number" placeholder="Discount value" required />
          <Input name="usageLimit" type="number" placeholder="Usage limit" required />
          <Input name="expiresAt" type="datetime-local" required />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input name="active" type="checkbox" className="h-4 w-4" defaultChecked />
            Active
          </label>
        </div>
        <Button className="w-full" disabled={submitting}>
          {submitting ? "Saving..." : "Create coupon"}
        </Button>
      </form>
      <div className="mt-6 space-y-3">
        {coupons.map((coupon) => {
          const progress = coupon.usageLimit > 0 ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : 0;
          return (
            <div key={coupon.id} className="rounded-2xl border border-border/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {coupon.type === "percent" ? <Percent className="mr-1 inline h-3.5 w-3.5" /> : <Ticket className="mr-1 inline h-3.5 w-3.5" />}
                    {coupon.value} value
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${coupon.active ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-slate-500/10 text-slate-700 dark:text-slate-300"}`}>
                  {coupon.active ? "active" : "inactive"}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Used {coupon.usedCount} of {coupon.usageLimit}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
