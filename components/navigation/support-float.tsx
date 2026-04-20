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

export function SupportFloat({ supportChannels }: { supportChannels: SupportChannel[] }) {
  const channels = supportChannels.filter((channel) => channel.active).slice(0, 2);

  if (!channels.length) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-6">
      <div className="rounded-[1.5rem] border border-border/70 bg-background/88 p-2 shadow-[0_20px_42px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Need help
        </p>
        <div className="flex flex-col gap-2">
          {channels.map((channel) => {
            const Icon = getSupportIcon(channel);
            const emphasized = getSupportChannelIconType(channel) === "whatsapp";
            const href = normalizeSupportHref(channel.href);
            const internal = href.startsWith("/");

            return (
              <a
                key={channel.id}
                href={href}
                target={internal ? undefined : "_blank"}
                rel={internal ? undefined : "noreferrer noopener"}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 ${
                  emphasized
                    ? "border border-success/30 bg-success shadow-[0_10px_24px_rgba(47,107,87,0.22)]"
                    : "border border-primary/30 bg-foreground shadow-[0_10px_24px_rgba(23,26,33,0.22)]"
                }`}
                aria-label={channel.buttonLabel || channel.title}
              >
                <Icon size={16} className={emphasized ? "" : "text-primary"} />
                <span>{channel.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
