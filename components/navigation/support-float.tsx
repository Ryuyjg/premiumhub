import { MessageCircle, Send } from "lucide-react";

export function SupportFloat() {
  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-2 md:right-6 md:bottom-8">
      <a
        href="https://wa.me/917907102615"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={16} />
        <span>WhatsApp</span>
      </a>
      <a
        href="https://t.me/ogdigital"
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center gap-2 rounded-full border border-sky-300/60 bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
        aria-label="Open Telegram"
      >
        <Send size={16} />
        <span>Telegram</span>
      </a>
    </div>
  );
}
