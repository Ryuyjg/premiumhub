import { Suspense } from "react";
import { APP_NAME } from "@/lib/constants";
import { AuthCard } from "@/components/auth/auth-card";
import { HeadphonesIcon, LayoutDashboard, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure access",
    desc: "Account sessions, protected routes, and delivery records stay organized in one place."
  },
  {
    icon: LayoutDashboard,
    title: "Clear customer area",
    desc: "Orders, renewals, credentials, and support history live inside a cleaner dashboard."
  },
  {
    icon: HeadphonesIcon,
    title: "Direct support flow",
    desc: "Customers can move from purchase questions to follow-up help without leaving the platform."
  }
];

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden py-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-border/70 bg-white/78 p-7 shadow-[0_20px_48px_rgba(15,23,42,0.05)] backdrop-blur-md dark:bg-white/4 lg:p-8">
          <div className="space-y-4">
            <span className="glow-badge">{APP_NAME} Account Area</span>
            <h1 className="text-4xl font-black tracking-tight xl:text-5xl">
              Sign in to the
              <span className="gradient-text block">customer workspace.</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-muted-foreground">
              This is where customers manage purchases, receive delivery information, and open support conversations
              after checkout.
            </p>
          </div>

          <div className="mt-8 space-y-3.5">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/72 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-[1.5rem] border border-border/70 bg-background/72 p-4 text-sm leading-7 text-muted-foreground">
            Use this area for real customer activity, not filler. Once products and payments are finalized, the account
            flow is already in place.
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Suspense>
            <AuthCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
