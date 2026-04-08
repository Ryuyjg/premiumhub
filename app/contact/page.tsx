import Link from "next/link";
import { HeadphonesIcon, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { ContentPageShell } from "@/components/marketing/content-page-shell";

const contactCards = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Best for quick pre-sale questions and urgent order follow-up.",
    href: "https://wa.me/917907102615",
    label: "Open WhatsApp"
  },
  {
    icon: Send,
    title: "Telegram",
    description: "Use this for updates, screenshots, and support conversations that need a longer thread.",
    href: "https://t.me/ogdigital",
    label: "Open Telegram"
  },
  {
    icon: ShieldCheck,
    title: "Dashboard support",
    description: "Signed-in customers should also use the support area inside the account dashboard for tracked requests.",
    href: "/dashboard",
    label: "Open dashboard"
  }
];

export default function ContactPage() {
  return (
    <ContentPageShell
      eyebrow="Contact"
      title="Support should be easy to find."
      description="If a customer has a question before or after purchase, these are the fastest paths to reach the store."
    >
      <div className="space-y-10">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => (
            <div key={card.title} className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
              <Link href={card.href} className="btn-primary mt-5 inline-flex h-11 px-5 text-sm">
                {card.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <HeadphonesIcon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">When asking for help</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>Include the order ID, product name, and a short description of the issue.</p>
            <p>If the issue is delivery-related, mention whether the item was manual, invite-based, or direct access.</p>
            <p>For faster handling, send screenshots when a payment or login issue is involved.</p>
          </div>
        </div>
      </div>
    </ContentPageShell>
  );
}
