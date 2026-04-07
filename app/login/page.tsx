import { Suspense } from "react";
import { APP_NAME } from "@/lib/constants";
import { AuthCard } from "@/components/auth/auth-card";
import { ShieldCheck, Zap, Star } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Verified billing", desc: "Razorpay checkout with server-side payment verification" },
  { icon: Zap, title: "Instant credentials", desc: "Get account access quickly after successful payment" },
  { icon: Star, title: "Real human support", desc: "Raise a ticket from dashboard and get guided help fast" }
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
        {/* Left - feature pitch */}
        <div className="hidden space-y-10 lg:block">
          <div className="space-y-4">
            <span className="glow-badge">{APP_NAME} Client Portal</span>
            <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
              Trusted access to <span className="gradient-text">premium subscriptions.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Sign in to manage plans, view credentials, track renewals, and get support from one secure workspace.
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
              Trusted by <span className="font-semibold text-foreground">10,000+</span> paying customers
            </p>
          </div>
        </div>

        {/* Right - auth form */}
        <div className="flex justify-center lg:justify-end">
          <Suspense>
            <AuthCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
