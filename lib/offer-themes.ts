export type OfferTheme = {
  id: string;
  name: string;
  description: string;
  gradient: string;
  glow: string;
};

export const OFFER_THEMES: OfferTheme[] = [
  {
    id: "ocean",
    name: "Ocean",
    description: "Teal to deep blue",
    gradient: "linear-gradient(135deg, rgba(13,148,136,0.98) 0%, rgba(8,145,178,0.95) 48%, rgba(30,64,175,0.98) 100%)",
    glow: "rgba(34, 211, 238, 0.35)"
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Indigo to magenta",
    gradient: "linear-gradient(135deg, rgba(79,70,229,0.98) 0%, rgba(124,58,237,0.96) 50%, rgba(217,70,239,0.98) 100%)",
    glow: "rgba(196, 181, 253, 0.32)"
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "Slate luxury neutral",
    gradient: "linear-gradient(135deg, rgba(30,41,59,0.98) 0%, rgba(51,65,85,0.96) 45%, rgba(15,23,42,0.98) 100%)",
    glow: "rgba(148, 163, 184, 0.24)"
  },
  {
    id: "ember",
    name: "Ember",
    description: "Amber to coral",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.98) 0%, rgba(249,115,22,0.96) 52%, rgba(239,68,68,0.98) 100%)",
    glow: "rgba(251, 191, 36, 0.34)"
  },
  {
    id: "verdant",
    name: "Verdant",
    description: "Emerald to jade",
    gradient: "linear-gradient(135deg, rgba(5,150,105,0.98) 0%, rgba(16,185,129,0.96) 46%, rgba(6,95,70,0.98) 100%)",
    glow: "rgba(52, 211, 153, 0.32)"
  }
];

const LEGACY_ACCENT_MAP: Record<string, string> = {
  "from-cyan-500 to-blue-600": "ocean",
  "from-violet-500 to-fuchsia-600": "aurora",
  "from-slate-700 to-slate-900": "graphite",
  "from-amber-500 to-orange-600": "ember",
  "from-emerald-500 to-teal-600": "verdant"
};

export function resolveOfferTheme(accent?: string) {
  const normalized = (accent || "").trim().toLowerCase();
  const resolvedId = LEGACY_ACCENT_MAP[normalized] || normalized || "ocean";
  return OFFER_THEMES.find((theme) => theme.id === resolvedId) || OFFER_THEMES[0];
}
