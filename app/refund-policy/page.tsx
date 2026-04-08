import { ContentPageShell } from "@/components/marketing/content-page-shell";

const policyPoints = [
  "Refund requests should be raised as soon as the issue is noticed, along with the order ID and a clear explanation.",
  "Digital items that have already been fully delivered, revealed, activated, or consumed are generally not refundable.",
  "If an item cannot be delivered as described, replacement, store credit, or refund may be offered depending on the situation.",
  "Manual or invite-based delivery items may require additional review time before a refund decision is made.",
  "Abuse, duplicate claims, chargeback threats, or policy manipulation can lead to refund denial and account restriction."
];

export default function RefundPolicyPage() {
  return (
    <ContentPageShell
      eyebrow="Refund Policy"
      title="Clear expectations before and after purchase."
      description="This policy is designed to keep digital orders fair for both the customer and the store while still allowing support on legitimate delivery issues."
    >
      <div className="space-y-8">
        <div className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
          <h2 className="text-2xl font-black tracking-tight">General policy</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            {policyPoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
            <h3 className="text-xl font-semibold">Eligible cases</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Undelivered orders, invalid delivery, duplicate charges, or store-side fulfillment failure can qualify for
              correction or refund.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
            <h3 className="text-xl font-semibold">Non-eligible cases</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Used digital access, changed mind after delivery, unsupported misuse, or customer-side policy violations
              are generally not refundable.
            </p>
          </div>
        </div>
      </div>
    </ContentPageShell>
  );
}
