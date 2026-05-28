import { STARTER_CATEGORIES } from "@/lib/catalog";
import { slugify } from "@/lib/utils";

type DeliveryMode = "direct_credentials" | "otp_manual" | "email_invite";

type ProductSeedTemplate = {
  name: string;
  iconSlug: string;
  hook: string;
  minPrice: number;
  maxPrice: number;
  durationInDays: number;
  featured?: boolean;
  bestSelling?: boolean;
  deliveryMode?: DeliveryMode;
};

type SeedCategory = (typeof STARTER_CATEGORIES)[number];

type CatalogSeedProduct = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  discount: number;
  categoryId: string;
  categoryName: string;
  durationInDays: number;
  imageUrls: string[];
  features: string[];
  featured: boolean;
  bestSelling: boolean;
  deliveryMode: DeliveryMode;
  otpSupportNumber: string | null;
  deliveryNotes: string;
  stockStatus: "active";
  createdAt: string;
  updatedAt: string;
};

const FEATURES_BY_CATEGORY: Record<string, string[]> = {
  "ai-plans": ["Fast account activation", "Stable access window", "Priority support chat"],
  "ott-plans": ["HD streaming enabled", "Reliable renewal cycle", "Quick replacement support"],
  games: ["Low-latency redemption", "Guaranteed account validity", "Support on purchase issues"],
  softwares: ["Genuine licensed access", "Update-friendly builds", "Helpdesk onboarding"],
  "virtual-numbers": ["Region-based provisioning", "Activation support included", "Flexible validity windows"],
  "telegram-sessions": ["Safe onboarding workflow", "Session setup guidance", "Response-time SLA support"],
  "telegram-auto-software": ["Automation-ready templates", "Scalable campaign workflows", "Setup notes included"]
};

const CATEGORY_PRODUCT_TEMPLATES: Record<string, ProductSeedTemplate[]> = {
  "ai-plans": [
    { name: "ChatGPT Plus Monthly", iconSlug: "openai", hook: "priority GPT access", minPrice: 349, maxPrice: 799, durationInDays: 30, featured: true, bestSelling: true },
    { name: "Claude Pro Monthly", iconSlug: "anthropic", hook: "long-context AI workflows", minPrice: 349, maxPrice: 899, durationInDays: 30, bestSelling: true },
    { name: "Google Gemini Advanced", iconSlug: "googlegemini", hook: "Gemini premium capability", minPrice: 299, maxPrice: 749, durationInDays: 30 },
    { name: "Perplexity Pro Plan", iconSlug: "perplexity", hook: "research-first AI answers", minPrice: 299, maxPrice: 699, durationInDays: 30 },
    { name: "DALL-E Image Studio", iconSlug: "openai", hook: "premium AI image generation", minPrice: 399, maxPrice: 999, durationInDays: 30, featured: true },
    { name: "Notion AI Workspace", iconSlug: "notion", hook: "AI writing and docs support", minPrice: 249, maxPrice: 649, durationInDays: 30 },
    { name: "Canva AI Pro Bundle", iconSlug: "canva", hook: "creative AI toolkit", minPrice: 249, maxPrice: 599, durationInDays: 30 },
    { name: "GitHub Copilot Individual", iconSlug: "github", hook: "AI coding assistant", minPrice: 299, maxPrice: 799, durationInDays: 30, bestSelling: true },
    { name: "Grammarly Premium AI", iconSlug: "grammarly", hook: "advanced writing optimization", minPrice: 199, maxPrice: 549, durationInDays: 30 },
    { name: "Figma AI Collab Access", iconSlug: "figma", hook: "design intelligence workflows", minPrice: 249, maxPrice: 699, durationInDays: 30 }
  ],
  "ott-plans": [
    { name: "Netflix Premium 4K", iconSlug: "netflix", hook: "4K multi-screen streaming", minPrice: 179, maxPrice: 599, durationInDays: 30, featured: true, bestSelling: true },
    { name: "Prime Video Subscription", iconSlug: "primevideo", hook: "movies and originals access", minPrice: 149, maxPrice: 499, durationInDays: 30, bestSelling: true },
    { name: "HBO Max Streaming Plan", iconSlug: "hbomax", hook: "family OTT entertainment", minPrice: 129, maxPrice: 449, durationInDays: 30 },
    { name: "Hulu Streaming Access", iconSlug: "hulu", hook: "series and live channels", minPrice: 159, maxPrice: 499, durationInDays: 30 },
    { name: "Apple TV+ Access", iconSlug: "appletv", hook: "Apple originals streaming", minPrice: 149, maxPrice: 429, durationInDays: 30 },
    { name: "YouTube Premium Plan", iconSlug: "youtube", hook: "ad-free video and music", minPrice: 139, maxPrice: 399, durationInDays: 30 },
    { name: "Spotify Premium Family", iconSlug: "spotify", hook: "music and podcasts premium", minPrice: 119, maxPrice: 349, durationInDays: 30 },
    { name: "Crunchyroll Mega Fan", iconSlug: "crunchyroll", hook: "anime premium catalog", minPrice: 159, maxPrice: 479, durationInDays: 30 },
    { name: "Paramount+ Streaming", iconSlug: "paramountplus", hook: "blockbusters and sports", minPrice: 149, maxPrice: 449, durationInDays: 30 },
    { name: "Twitch Turbo Upgrade", iconSlug: "twitch", hook: "ad-reduced live streaming", minPrice: 99, maxPrice: 299, durationInDays: 30 }
  ],
  games: [
    { name: "Xbox Game Pass Ultimate", iconSlug: "xbox", hook: "console + PC game library", minPrice: 299, maxPrice: 899, durationInDays: 30, featured: true, bestSelling: true },
    { name: "PlayStation Plus Deluxe", iconSlug: "playstation", hook: "PS catalog and cloud gaming", minPrice: 299, maxPrice: 949, durationInDays: 30, bestSelling: true },
    { name: "Nintendo Switch Online", iconSlug: "nintendo", hook: "multiplayer and retro titles", minPrice: 199, maxPrice: 649, durationInDays: 30 },
    { name: "Steam Wallet Top-up", iconSlug: "steam", hook: "instant wallet balance delivery", minPrice: 149, maxPrice: 999, durationInDays: 30 },
    { name: "Epic Games Wallet", iconSlug: "epicgames", hook: "Fortnite and game purchases", minPrice: 149, maxPrice: 999, durationInDays: 30 },
    { name: "EA Play Subscription", iconSlug: "ea", hook: "EA game library access", minPrice: 199, maxPrice: 699, durationInDays: 30 },
    { name: "Ubisoft+ Access", iconSlug: "ubisoft", hook: "Ubisoft premium catalog", minPrice: 249, maxPrice: 799, durationInDays: 30 },
    { name: "Valorant Points Bundle", iconSlug: "riotgames", hook: "instant VP top-up", minPrice: 149, maxPrice: 899, durationInDays: 30 },
    { name: "Minecraft Java Access", iconSlug: "minecraft", hook: "official game account setup", minPrice: 249, maxPrice: 899, durationInDays: 30 },
    { name: "Roblox Premium Pass", iconSlug: "roblox", hook: "monthly premium benefits", minPrice: 129, maxPrice: 499, durationInDays: 30 }
  ],
  softwares: [
    { name: "Microsoft 365 Personal", iconSlug: "microsoftoffice", hook: "Office apps and cloud drive", minPrice: 299, maxPrice: 1099, durationInDays: 365, featured: true, bestSelling: true },
    { name: "Adobe Creative Cloud", iconSlug: "adobe", hook: "pro design and editing tools", minPrice: 399, maxPrice: 1299, durationInDays: 30, bestSelling: true },
    { name: "Autodesk Student Plus", iconSlug: "autodesk", hook: "CAD and 3D workflows", minPrice: 349, maxPrice: 1199, durationInDays: 30 },
    { name: "JetBrains All Products", iconSlug: "jetbrains", hook: "developer IDE toolkit", minPrice: 349, maxPrice: 999, durationInDays: 30 },
    { name: "Figma Pro Team Seat", iconSlug: "figma", hook: "design collaboration suite", minPrice: 249, maxPrice: 799, durationInDays: 30 },
    { name: "Grammarly Premium Suite", iconSlug: "grammarly", hook: "advanced writing checks", minPrice: 199, maxPrice: 599, durationInDays: 30 },
    { name: "Canva Teams Pro", iconSlug: "canva", hook: "brand kit and publishing", minPrice: 199, maxPrice: 699, durationInDays: 30 },
    { name: "Notion Business Workspace", iconSlug: "notion", hook: "documents and knowledge base", minPrice: 199, maxPrice: 649, durationInDays: 30 },
    { name: "Slack Pro Workspace", iconSlug: "slack", hook: "team communication premium", minPrice: 199, maxPrice: 599, durationInDays: 30 },
    { name: "Zoom Pro Meetings", iconSlug: "zoom", hook: "professional meetings access", minPrice: 199, maxPrice: 599, durationInDays: 30 }
  ],
  "virtual-numbers": [
    { name: "Twilio Verify Number", iconSlug: "twilio", hook: "enterprise verification flow", minPrice: 99, maxPrice: 349, durationInDays: 30, featured: true },
    { name: "Vonage Virtual Line", iconSlug: "vonage", hook: "global communication ready", minPrice: 99, maxPrice: 329, durationInDays: 30 },
    { name: "SendGrid Verify Number", iconSlug: "sendgrid", hook: "API-driven number access", minPrice: 99, maxPrice: 299, durationInDays: 30 },
    { name: "Mailgun SMS Number", iconSlug: "mailgun", hook: "high-quality SMS routing", minPrice: 119, maxPrice: 349, durationInDays: 30 },
    { name: "Zoom Phone Number", iconSlug: "zoom", hook: "business-grade calling", minPrice: 129, maxPrice: 399, durationInDays: 30 },
    { name: "Intercom Setup Number", iconSlug: "intercom", hook: "startup operations friendly", minPrice: 119, maxPrice: 349, durationInDays: 30 },
    { name: "Proton Privacy Number", iconSlug: "protonmail", hook: "privacy-first verification", minPrice: 89, maxPrice: 299, durationInDays: 30 },
    { name: "Skype Number Subscription", iconSlug: "skype", hook: "global calls and inbound", minPrice: 99, maxPrice: 299, durationInDays: 30 },
    { name: "Telegram OTP Number", iconSlug: "telegram", hook: "quick Telegram activation", minPrice: 89, maxPrice: 249, durationInDays: 30 },
    { name: "WhatsApp Verify Number", iconSlug: "whatsapp", hook: "OTP-ready provisioning", minPrice: 99, maxPrice: 299, durationInDays: 30 }
  ],
  "telegram-sessions": [
    { name: "Telegram Session Setup Basic", iconSlug: "telegram", hook: "guided setup for fresh sessions", minPrice: 149, maxPrice: 499, durationInDays: 30, featured: true, deliveryMode: "email_invite" },
    { name: "Telegram Session Setup Pro", iconSlug: "telegram", hook: "enhanced onboarding support", minPrice: 199, maxPrice: 599, durationInDays: 30, bestSelling: true, deliveryMode: "email_invite" },
    { name: "Telegram Channel Team Session", iconSlug: "telegram", hook: "team-managed Telegram flow", minPrice: 199, maxPrice: 649, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Discord Session", iconSlug: "discord", hook: "cross-platform community support", minPrice: 199, maxPrice: 699, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Slack Session", iconSlug: "slack", hook: "ops and support handoff workflows", minPrice: 199, maxPrice: 699, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Zoom Session", iconSlug: "zoom", hook: "live support workflow setup", minPrice: 199, maxPrice: 699, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Signal Session", iconSlug: "signal", hook: "private communication pairing", minPrice: 159, maxPrice: 549, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Meet Session", iconSlug: "googlemeet", hook: "meeting-linked Telegram support", minPrice: 179, maxPrice: 579, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Session Audit Pack", iconSlug: "telegram", hook: "security and flow review", minPrice: 249, maxPrice: 799, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Session Recovery Assist", iconSlug: "telegram", hook: "assisted recovery guidance", minPrice: 149, maxPrice: 599, durationInDays: 30, deliveryMode: "email_invite" }
  ],
  "telegram-auto-software": [
    { name: "Telegram Auto Responder Pro", iconSlug: "telegram", hook: "auto-reply and routing engine", minPrice: 349, maxPrice: 1199, durationInDays: 30, featured: true, bestSelling: true, deliveryMode: "email_invite" },
    { name: "Telegram Campaign Scheduler", iconSlug: "telegram", hook: "broadcast scheduling workflows", minPrice: 299, maxPrice: 1099, durationInDays: 30, featured: true, deliveryMode: "email_invite" },
    { name: "Telegram CRM Sync Toolkit", iconSlug: "hubspot", hook: "lead sync and enrichment", minPrice: 349, maxPrice: 1199, durationInDays: 30, bestSelling: true, deliveryMode: "email_invite" },
    { name: "Telegram Automation with n8n", iconSlug: "n8n", hook: "node-based automation pack", minPrice: 299, maxPrice: 999, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Automation with Zapier", iconSlug: "zapier", hook: "no-code automations bundle", minPrice: 299, maxPrice: 999, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Automation with Make", iconSlug: "make", hook: "scenario-based orchestration", minPrice: 299, maxPrice: 999, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram + Airtable Workflow", iconSlug: "airtable", hook: "ops and tracking integration", minPrice: 299, maxPrice: 999, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Support Bot Starter", iconSlug: "intercom", hook: "customer support bot stack", minPrice: 249, maxPrice: 899, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Sales Funnel Bot", iconSlug: "notion", hook: "lead capture to follow-up flow", minPrice: 349, maxPrice: 1099, durationInDays: 30, deliveryMode: "email_invite" },
    { name: "Telegram Broadcast Compliance Pack", iconSlug: "telegram", hook: "safe opt-in broadcast toolkit", minPrice: 349, maxPrice: 1099, durationInDays: 30, deliveryMode: "email_invite" }
  ]
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function iconUrl(iconSlug: string) {
  return `/product-logos/${iconSlug}.svg`;
}

function buildProductDescription(template: ProductSeedTemplate, category: SeedCategory) {
  return `${template.name} gives you ${template.hook} with managed onboarding, stable delivery, and responsive support for ${category.name.toLowerCase()} buyers.`;
}

function buildProductFeatures(categorySlug: string) {
  return FEATURES_BY_CATEGORY[categorySlug] || ["Fast setup", "Reliable delivery", "Priority support"];
}

export function buildCatalogSeed() {
  const now = new Date().toISOString();
  const categories = STARTER_CATEGORIES.map((category) => ({
    id: category.slug,
    name: category.name,
    slug: category.slug,
    description: category.description,
    order: category.order,
    featured: Boolean(category.slug === "telegram-auto-software"),
    seeded: true,
    createdAt: now,
    updatedAt: now
  }));

  const products: CatalogSeedProduct[] = [];

  for (const category of STARTER_CATEGORIES) {
    const templates = CATEGORY_PRODUCT_TEMPLATES[category.slug] || [];
    templates.forEach((template, index) => {
      const price = randomInt(template.minPrice, template.maxPrice);
      const discount = randomInt(8, 32);
      const withSalePrice = Math.random() > 0.2;
      const salePrice = withSalePrice ? Math.max(Math.round(price * ((100 - discount) / 100)), 1) : null;

      products.push({
        name: template.name,
        slug: slugify(template.name),
        shortDescription: `${template.hook.charAt(0).toUpperCase()}${template.hook.slice(1)} with trusted delivery.`,
        description: buildProductDescription(template, category),
        price,
        salePrice,
        discount: salePrice ? discount : 0,
        categoryId: category.slug,
        categoryName: category.name,
        durationInDays: template.durationInDays,
        imageUrls: [iconUrl(template.iconSlug)],
        features: buildProductFeatures(category.slug),
        featured: Boolean(template.featured || index === 0),
        bestSelling: Boolean(template.bestSelling || index === 1),
        deliveryMode: template.deliveryMode || "email_invite",
        otpSupportNumber: "",
        deliveryNotes: "Delivery instructions and setup notes are shared after successful purchase.",
        stockStatus: "active",
        createdAt: now,
        updatedAt: now
      });
    });
  }

  return { categories, products };
}
