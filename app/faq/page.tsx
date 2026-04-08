import { ContentPageShell } from "@/components/marketing/content-page-shell";

const faqs = [
  {
    question: "What does OTT SHOP sell?",
    answer: "The storefront is built for curated digital products such as subscriptions, software access, private offers, and account-based digital items."
  },
  {
    question: "Why is the catalog smaller right now?",
    answer: "The site was intentionally reset so products can be added back manually with stronger copy, better visuals, and cleaner delivery details."
  },
  {
    question: "Is checkout active?",
    answer: "External gateway checkout is currently paused while the next payment flow is being prepared. Wallet checkout may remain available for approved customers."
  },
  {
    question: "Where do customers receive their delivery details?",
    answer: "Orders, credentials, invite delivery information, and support updates are meant to appear inside the customer dashboard after checkout."
  },
  {
    question: "How do I get support?",
    answer: "Customers can use WhatsApp, Telegram, or the in-dashboard support flow depending on the issue."
  },
  {
    question: "Can products be out of stock?",
    answer: "Yes. Stock status is managed per product so the store can avoid selling items that are not ready for delivery."
  },
  {
    question: "Do all items deliver the same way?",
    answer: "No. Some items may deliver directly, some may require manual OTP handling, and some may use invite-based access."
  },
  {
    question: "Will more products be added later?",
    answer: "Yes. The site is now prepared for a cleaner manual restock instead of relying on old starter inventory."
  }
];

export default function FaqPage() {
  return (
    <ContentPageShell
      eyebrow="FAQ"
      title="Common questions, answered clearly."
      description="This page sets expectations for how the store works now, how delivery is handled, and what customers should expect as the catalog grows again."
    >
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-[1.5rem] border border-border/70 bg-background/72 p-5">
            <p className="text-lg font-semibold">{faq.question}</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </ContentPageShell>
  );
}
