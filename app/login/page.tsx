import { Suspense } from "react";
import { APP_NAME } from "@/lib/constants";
import { AuthCard } from "@/components/auth/auth-card";
import { ShieldCheck, Zap, Star } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Secure checkout", desc: "Razorpay-powered payments with HMAC verification" },
  { icon: Zap, title: "Instant delivery", desc: "Credentials assigned in under 15 seconds" },
  { icon: Star, title: "Premium support", desc: "Raise tickets directly from your dashboard" }
];

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="container grid min-h-[calc(100vh-5rem)] items-center gap-12 py-20 lg:grid-cols-[1fr_1fr]">
        {/* Left — feature pitch */}
        <div className="hidden space-y-10 lg:block">
          <div className="space-y-4">
            <span className="glow-badge">{APP_NAME} Portal</span>
            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Your subscriptions,{" "}
              <span className="gradient-text">fully in control.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Sign in to manage all your OTT plans, view credentials, track expiry, and raise support tickets — all from one dashboard.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-white/60 p-4 backdrop-blur-sm dark:bg-white/4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{f.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof strip */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["from-violet-500 to-purple-600", "from-blue-500 to-cyan-600", "from-amber-500 to-orange-600", "from-emerald-500 to-teal-600"].map((g, i) => (
                <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${g} text-xs font-bold text-white ring-2 ring-background`}>
                  {["P", "R", "A", "K"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">10,000+</span> customers already signed in
            </p>
          </div>
        </div>

        {/* Right — auth form */}
        <div className="flex justify-center lg:justify-end">
          <Suspense>
            <AuthCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
