import { MessageCircle, Send } from "lucide-react";

export function SupportFloat() {
  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-6">
      <div className="rounded-[1.5rem] border border-border/70 bg-background/88 p-2 shadow-[0_20px_42px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          Need help
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://wa.me/917907102615"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 rounded-full border border-success/30 bg-success px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,107,87,0.22)] transition-transform hover:-translate-y-0.5"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://t.me/ogdigital"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 rounded-full border border-primary/30 bg-foreground px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,26,33,0.22)] transition-transform hover:-translate-y-0.5"
            aria-label="Open Telegram"
          >
            <Send size={16} className="text-primary" />
            <span>Telegram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
