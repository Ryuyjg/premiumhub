import { ContentPageShell } from "@/components/marketing/content-page-shell";

const privacySections = [
  {
    title: "Information collected",
    text: "The store may collect account information, order details, support messages, and technical session data needed to operate the platform."
  },
  {
    title: "Why it is used",
    text: "This information is used to deliver orders, manage accounts, provide support, improve site operations, and protect against misuse."
  },
  {
    title: "Support records",
    text: "Messages sent through support channels may be reviewed to resolve issues, confirm delivery, and handle disputes fairly."
  },
  {
    title: "Security",
    text: "Reasonable steps are taken to protect account sessions and platform data, but customers should also protect their own passwords and devices."
  },
  {
    title: "Sharing",
    text: "Customer information is not meant to be sold casually. It may only be shared when required for service delivery, platform operations, or legal compliance."
  }
];

export default function PrivacyPage() {
  return (
    <ContentPageShell
      eyebrow="Privacy"
      title="Privacy matters because trust matters."
      description="This page explains the basic kinds of information the store may handle and the reasons it is used."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {privacySections.map((section) => (
          <div key={section.title} className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.text}</p>
          </div>
        ))}
      </div>
    </ContentPageShell>
  );
}
