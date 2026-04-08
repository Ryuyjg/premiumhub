"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, BadgeCheck, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (user) router.replace(searchParams.get("redirect") || "/products");
  }, [authLoading, router, searchParams, user]);

  async function persistSession() {
    const auth = getClientAuth();
    if (!auth) throw new Error("Firebase client configuration missing.");
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    if (!res.ok) throw new Error("Unable to start secure session.");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase client configuration missing.");
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(creds.user, { displayName: name });
      } else {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase client configuration missing.");
        await signInWithEmailAndPassword(auth, email, password);
      }
      await persistSession();
      toast.success(mode === "register" ? "Account created successfully." : "Welcome back.");
      router.replace(searchParams.get("redirect") || "/products");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      if (message.includes("Firebase client configuration")) {
        toast.error("Firebase not configured. Add env variables in Vercel.");
      } else if (
        message.includes("user-not-found") ||
        message.includes("wrong-password") ||
        message.includes("invalid-credential")
      ) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border/60 bg-white/78 p-7 shadow-[0_26px_70px_rgba(2,6,23,0.1)] backdrop-blur-2xl dark:bg-white/5 md:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="absolute -top-16 left-1/2 h-32 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mb-7 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl font-black tracking-tight">{mode === "login" ? "Sign in" : "Create account"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Open your orders, delivery history, and support records."
                : "Create a customer account for faster checkout and organized follow-up."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative mb-6 grid grid-cols-2 rounded-2xl border border-border/60 bg-muted/35 p-1">
        <motion.div
          layoutId="auth-tab"
          className="absolute inset-y-1 rounded-xl bg-white shadow-sm dark:bg-white/10"
          style={{ width: "calc(50% - 4px)", x: mode === "login" ? 0 : "calc(100% + 2px)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`relative z-10 rounded-xl py-2.5 text-sm font-bold transition-colors ${mode === "login" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`relative z-10 rounded-xl py-2.5 text-sm font-bold transition-colors ${mode === "register" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AnimatePresence>
          {mode === "register" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="field pl-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email address"
            required
            className="field pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="field pl-10"
          />
        </div>

        <Button className="mt-2 h-12 w-full gap-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            <>
              {mode === "login" ? "Continue" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-border/55 bg-muted/30 p-3.5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Protected sessions
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" /> Secure sign-in
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" /> Verified account area
          </span>
        </div>
      </div>
    </div>
  );
}
