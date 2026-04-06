"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Lock, Mail, User, Zap, ArrowRight, ShieldCheck } from "lucide-react";
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
    if (user) router.replace(searchParams.get("redirect") || "/dashboard");
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase client configuration missing.");
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        if (name) await updateProfile(creds.user, { displayName: name });
      } else {
        const adminRes = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (adminRes.ok) {
          toast.success("Admin access granted.");
          router.replace("/admin");
          router.refresh();
          return;
        }
        const auth = getClientAuth();
        if (!auth) throw new Error("Firebase client configuration missing.");
        await signInWithEmailAndPassword(auth, email, password);
      }
      await persistSession();
      toast.success(mode === "register" ? "Account created! Welcome 🎉" : "Welcome back!");
      router.replace(searchParams.get("redirect") || "/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      if (message.includes("Firebase client configuration")) {
        toast.error("Firebase not configured. Add env variables in Vercel.");
      } else if (message.includes("user-not-found") || message.includes("wrong-password") || message.includes("invalid-credential")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-8 shadow-premium backdrop-blur-2xl dark:border-white/8 dark:bg-white/4">
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-12 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      {/* Logo */}
      <div className="relative mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
          <Zap className="h-6 w-6 text-white" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to manage your subscriptions"
                : "Join thousands of happy customers"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mode toggle */}
      <div className="relative mb-6 flex rounded-2xl border border-border/60 bg-muted/40 p-1">
        <motion.div
          layoutId="auth-tab"
          className="absolute inset-y-1 rounded-xl bg-white shadow-sm dark:bg-white/10"
          style={{ width: "calc(50% - 4px)", x: mode === "login" ? 0 : "calc(100% + 2px)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${mode === "login" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`relative z-10 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${mode === "register" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <AnimatePresence>
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="field pl-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Trust badges */}
      <div className="mt-6 flex items-center justify-center gap-4 border-t border-border/40 pt-5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Firebase Auth
        </div>
        <div className="h-3 w-px bg-border/60" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5 text-primary" />
          SSL Secured
        </div>
        <div className="h-3 w-px bg-border/60" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Instant access
        </div>
      </div>
    </div>
  );
}
