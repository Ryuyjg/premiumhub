import { ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { ContentPageShell } from "@/components/marketing/content-page-shell";

const pillars = [
  {
    icon: ShoppingBag,
    title: "Curated catalog",
    text: "Products are meant to be added intentionally, not stuffed into the storefront just to look bigger."
  },
  {
    icon: ShieldCheck,
    title: "Trust-first delivery",
    text: "Order records, customer support, and delivery handling stay organized in the platform instead of living entirely in chats."
  },
  {
    icon: Sparkles,
    title: "Built to evolve",
    text: "The storefront can improve step by step, with better products, stronger copy, and a future checkout gateway added later."
  }
];

export default function AboutPage() {
  return (
    <ContentPageShell
      eyebrow="About OTT SHOP"
      title="A cleaner store for curated digital sales."
      description="OTT SHOP is now structured as a premium, owner-managed digital storefront focused on better trust, better presentation, and better control over what goes live."
    >
      <div className="space-y-10">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[1.75rem] border border-border/55 bg-background/70 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <pillar.icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold">{pillar.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-black tracking-tight">What changed</h2>
          <div className="space-y-4 text-sm leading-8 text-muted-foreground">
            <p>
              The old filler inventory and weaker trust signals were removed so the site could start from a better
              foundation.
            </p>
            <p>
              The current version focuses on polished structure: stronger branding, real support visibility, cleaner
              product browsing, and an account area that is ready for real customer activity.
            </p>
            <p>
              Checkout gateway work can return later. The goal right now is to make the storefront itself worth trusting.
            </p>
          </div>
        </div>
      </div>
    </ContentPageShell>
  );
}
