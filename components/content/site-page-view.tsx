import Link from "next/link";
import { ContentPageShell } from "@/components/marketing/content-page-shell";
import { SupportChannelGrid } from "@/components/content/support-channel-grid";
import type { SitePage, SupportChannel } from "@/types";

function getParagraphs(body: string) {
  return body
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function SitePageView({
  page,
  supportChannels = []
}: {
  page: SitePage;
  supportChannels?: SupportChannel[];
}) {
  const paragraphs = getParagraphs(page.body || "");
  const activeSupportChannels = supportChannels.filter((channel) => channel.active);
  const bodyBlock = paragraphs.length ? (
    <div className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
      <div className="space-y-4 text-sm leading-8 text-muted-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <ContentPageShell eyebrow={page.eyebrow} title={page.title} description={page.description}>
      <div className="space-y-10">
        {page.showSupportChannels && activeSupportChannels.length ? (
          <SupportChannelGrid
            channels={activeSupportChannels}
            heading={page.slug === "support-channels" ? "Available channels" : "Support options"}
            description={
              activeSupportChannels.length > 1
                ? "Choose the support path that fits your issue."
                : "This is the currently active support option."
            }
          />
        ) : null}

        {page.layout === "policy" ? bodyBlock : null}

        {page.sections.length ? (
          page.layout === "faq" ? (
            <div className="space-y-4">
              {page.sections.map((section) => (
                <div key={section.id} className="rounded-[1.5rem] border border-border/70 bg-background/72 p-5">
                  <p className="text-lg font-semibold">{section.title}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.description}</p>
                  {section.href ? (
                    <Link href={section.href} className="mt-4 inline-flex text-sm font-semibold text-primary">
                      {section.ctaLabel || "Open"}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          ) : page.layout === "rules" ? (
            <div className="space-y-4">
              {page.sections.map((section, index) => (
                <div key={section.id} className="rounded-[1.5rem] border border-border/70 bg-background/72 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                    {section.title || `Rule ${index + 1}`}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page.sections.map((section) => (
                <div key={section.id} className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
                  <p className="text-lg font-semibold">{section.title}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.description}</p>
                  {section.href ? (
                    <Link href={section.href} className="mt-5 inline-flex text-sm font-semibold text-primary">
                      {section.ctaLabel || "Open"}
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          )
        ) : null}

        {page.layout !== "policy" ? bodyBlock : null}
      </div>
    </ContentPageShell>
  );
}
