import { ContentPageShell } from "@/components/marketing/content-page-shell";

const terms = [
  "Customers must provide accurate account information and keep their login credentials secure.",
  "Orders are for the purchased customer only unless the product description explicitly states otherwise.",
  "Products may have different delivery methods, usage rules, and replacement conditions depending on the item.",
  "The store may refuse or cancel orders involving fraud, misuse, policy abuse, or suspicious activity.",
  "Account access, dashboards, and support channels must not be used for harassment, spam, or illegal activity.",
  "Store policies, product listings, and payment methods may be updated over time as the storefront evolves."
];

export default function TermsPage() {
  return (
    <ContentPageShell
      eyebrow="Terms"
      title="Simple rules for using the store."
      description="These terms help set clear expectations around orders, accounts, support, and acceptable use of the platform."
    >
      <div className="space-y-4">
        {terms.map((term, index) => (
          <div key={term} className="rounded-[1.5rem] border border-border/55 bg-background/70 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Rule {index + 1}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{term}</p>
          </div>
        ))}
      </div>
    </ContentPageShell>
  );
}
