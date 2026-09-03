"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      let isSuccess = false;
      try {
        const response = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (response.ok) {
          isSuccess = true;
        }
      } catch {
        // Ignore network/static host error
      }

      // Static export fallback for GitHub Pages
      if (!isSuccess) {
        const validEmail = "anshifkp8590@gmail.com";
        const validPassword = "podapatti";

        if (email.trim().toLowerCase() === validEmail.toLowerCase() && password === validPassword) {
          isSuccess = true;
          document.cookie = "ott_admin=true; path=/; max-age=86400";
          if (typeof window !== "undefined") {
            localStorage.setItem("ott_admin", "true");
          }
        }
      }

      if (!isSuccess) {
        throw new Error("Invalid admin credentials.");
      }

      toast.success("Admin access granted.");
      if (typeof window !== "undefined") {
        window.location.assign("/premiumhub/admin");
      } else {
        router.push("/admin");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-500/20 bg-[linear-gradient(180deg,rgba(11,11,12,0.96),rgba(7,7,8,0.98))] p-7 shadow-[0_28px_72px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      <div className="relative mb-7 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">Admin sign in</h1>
          <p className="mt-1 text-sm text-zinc-400">
            This area is only for store management, catalog changes, and order operations.
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Admin email"
            required
            className="field border-zinc-700/90 bg-zinc-900/80 pl-10 text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500/60 focus:bg-zinc-900"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Admin password"
            required
            className="field border-zinc-700/90 bg-zinc-900/80 pl-10 text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500/60 focus:bg-zinc-900"
          />
        </div>

        <Button className="mt-2 h-12 w-full gap-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              Signing in...
            </span>
          ) : (
            <>
              Continue to admin
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
