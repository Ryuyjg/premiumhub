import Link from "next/link";
import { HeadphonesIcon, Mail, MessageCircle, Send } from "lucide-react";
import { getSupportChannelIconType } from "@/lib/site-content-defaults";
import { normalizeSupportHref } from "@/lib/url-normalize";
import type { SupportChannel } from "@/types";

function getSupportIcon(channel: Pick<SupportChannel, "title" | "href">) {
  const iconType = getSupportChannelIconType(channel);

  if (iconType === "whatsapp") {
    return MessageCircle;
  }
  if (iconType === "telegram") {
    return Send;
  }
  if (iconType === "mail") {
    return Mail;
  }
  return HeadphonesIcon;
}

function isInternalPath(href: string) {
  return href.startsWith("/");
}

export function SupportChannelGrid({
  channels,
  heading,
  description
}: {
  channels: SupportChannel[];
  heading?: string;
  description?: string;
}) {
  if (!channels.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      {heading || description ? (
        <div>
          {heading ? <h2 className="text-2xl font-black tracking-tight">{heading}</h2> : null}
          {description ? <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => {
          const Icon = getSupportIcon(channel);
          const href = normalizeSupportHref(channel.href);
          const internal = isInternalPath(href);

          return (
            <div key={channel.id} className="rounded-[1.75rem] border border-border/70 bg-background/72 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-semibold">{channel.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{channel.description}</p>
              {internal ? (
                <Link href={href} className="btn-primary mt-5 inline-flex h-11 px-5 text-sm">
                  {channel.buttonLabel}
                </Link>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary mt-5 inline-flex h-11 px-5 text-sm"
                >
                  {channel.buttonLabel}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
