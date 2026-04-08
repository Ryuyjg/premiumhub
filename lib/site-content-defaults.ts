import type { SitePage, SitePageSection, SupportChannel } from "@/types";

type SitePageSeed = Omit<SitePage, "id" | "createdAt" | "updatedAt">;
type SupportChannelSeed = Omit<SupportChannel, "id" | "createdAt" | "updatedAt">;

export const EDITABLE_SITE_PAGE_SLUGS = [
  "about",
  "contact",
  "faq",
  "support-channels",
  "refund-policy",
  "terms",
  "privacy",
  "store-faq"
] as const;

export type EditableSitePageSlug = (typeof EDITABLE_SITE_PAGE_SLUGS)[number];

function createSection(id: string, title: string, description: string, href?: string, ctaLabel?: string): SitePageSection {
  return { id, title, description, href, ctaLabel };
}

export const DEFAULT_SITE_PAGES: SitePageSeed[] = [
  {
    slug: "about",
    label: "About",
    footerGroup: "company",
    order: 0,
    eyebrow: "About OTT SHOP",
    title: "A cleaner store for curated digital sales.",
    description:
      "OTT SHOP is structured as an owner-managed digital storefront focused on trust, clarity, and better control over what goes live.",
    body: [
      "The catalog is meant to be added intentionally, not stuffed with filler just to look bigger.",
      "The current version focuses on cleaner branding, better support visibility, and a stronger foundation for real products."
    ].join("\n\n"),
    layout: "cards",
    sections: [
      createSection(
        "curated-catalog",
        "Curated catalog",
        "Products are meant to be added intentionally, with better copy, better visuals, and real delivery details."
      ),
      createSection(
        "trust-first-delivery",
        "Trust-first delivery",
        "Orders, delivery handling, and customer support stay organized inside the platform instead of living only in chat."
      ),
      createSection(
        "built-to-evolve",
        "Built to evolve",
        "The storefront can improve step by step while keeping the customer experience clean and premium."
      )
    ]
  },
  {
    slug: "contact",
    label: "Contact",
    footerGroup: "company",
    order: 1,
    eyebrow: "Contact",
    title: "Support should be easy to find.",
    description: "Customers should always know where to ask questions before or after purchase.",
    body: [
      "Use the channel that matches the type of help you need. Include the order ID, product name, and a short explanation so support can respond faster."
    ].join("\n\n"),
    layout: "cards",
    showSupportChannels: true,
    sections: [
      createSection("share-order-id", "Share the order ID", "Include the order ID and the product name in the first message."),
      createSection(
        "add-screenshots",
        "Add screenshots when needed",
        "Payment, login, and delivery issues move faster when screenshots are included."
      ),
      createSection(
        "use-dashboard",
        "Use dashboard support for tracked issues",
        "Signed-in customers can also use the support area inside their account dashboard."
      )
    ]
  },
  {
    slug: "faq",
    label: "FAQ",
    footerGroup: "company",
    order: 2,
    eyebrow: "FAQ",
    title: "Common questions, answered clearly.",
    description: "This page sets expectations for how the store works, how delivery is handled, and what customers should expect.",
    body: "",
    layout: "faq",
    sections: [
      createSection("faq-1", "What does OTT SHOP sell?", "The storefront is built for curated digital products, software, access plans, and private offers."),
      createSection("faq-2", "Why is the catalog smaller right now?", "The store was intentionally reset so products can be added back manually with stronger copy and cleaner delivery details."),
      createSection("faq-3", "Where do customers receive delivery details?", "Orders, credentials, invite delivery information, and support updates are meant to appear inside the customer dashboard."),
      createSection("faq-4", "Can products be out of stock?", "Yes. Stock status is managed per product so the store does not sell items that are not ready for delivery."),
      createSection("faq-5", "Do all items deliver the same way?", "No. Some items deliver directly, some require manual handling, and some use invite-based access."),
      createSection("faq-6", "Will more products be added later?", "Yes. The site is built for a clean manual restock instead of old starter inventory.")
    ]
  },
  {
    slug: "support-channels",
    label: "Support channels",
    footerGroup: "company",
    order: 3,
    eyebrow: "Support channels",
    title: "Choose the support channel that fits your issue.",
    description: "If multiple support links are active, customers can choose the fastest route for their situation.",
    body: "When multiple support channels are available, choose the one that best matches your issue and include the product name or order ID in the first message.",
    layout: "cards",
    showSupportChannels: true,
    sections: [
      createSection(
        "pre-sale-help",
        "Pre-sale help",
        "Use a fast chat channel for product questions, delivery clarifications, and availability checks."
      ),
      createSection(
        "post-order-help",
        "Post-order help",
        "For order-related issues, mention the order ID so support can check the record quickly."
      )
    ]
  },
  {
    slug: "refund-policy",
    label: "Refund policy",
    footerGroup: "policies",
    order: 4,
    eyebrow: "Refund policy",
    title: "Clear expectations before and after purchase.",
    description: "This policy keeps digital orders fair for both the customer and the store while still allowing help on legitimate issues.",
    body: [
      "Refund requests should be raised as soon as the issue is noticed, along with the order ID and a clear explanation.",
      "Digital items that have already been fully delivered, revealed, activated, or consumed are generally not refundable.",
      "If an item cannot be delivered as described, replacement, store credit, or refund may be offered depending on the situation.",
      "Manual or invite-based delivery items may require additional review time before a refund decision is made."
    ].join("\n\n"),
    layout: "policy",
    sections: [
      createSection(
        "eligible-cases",
        "Eligible cases",
        "Undelivered orders, invalid delivery, duplicate charges, or store-side fulfillment failure can qualify for correction or refund."
      ),
      createSection(
        "non-eligible-cases",
        "Non-eligible cases",
        "Used digital access, changed mind after delivery, unsupported misuse, or customer-side policy violations are generally not refundable."
      )
    ]
  },
  {
    slug: "terms",
    label: "Terms of use",
    footerGroup: "policies",
    order: 5,
    eyebrow: "Terms",
    title: "Simple rules for using the store.",
    description: "These terms help set clear expectations around orders, accounts, support, and acceptable platform use.",
    body: "",
    layout: "rules",
    sections: [
      createSection("rule-1", "Rule 1", "Customers must provide accurate account information and keep their login credentials secure."),
      createSection("rule-2", "Rule 2", "Orders are for the purchased customer only unless the product description explicitly states otherwise."),
      createSection("rule-3", "Rule 3", "Products may have different delivery methods, usage rules, and replacement conditions depending on the item."),
      createSection("rule-4", "Rule 4", "The store may refuse or cancel orders involving fraud, misuse, policy abuse, or suspicious activity."),
      createSection("rule-5", "Rule 5", "Support channels and account areas must not be used for harassment, spam, or illegal activity."),
      createSection("rule-6", "Rule 6", "Store policies, product listings, and payment methods may be updated over time as the storefront evolves.")
    ]
  },
  {
    slug: "privacy",
    label: "Privacy",
    footerGroup: "policies",
    order: 6,
    eyebrow: "Privacy",
    title: "Privacy matters because trust matters.",
    description: "This page explains the basic kinds of information the store may handle and the reasons it is used.",
    body: "",
    layout: "cards",
    sections: [
      createSection("privacy-1", "Information collected", "The store may collect account information, order details, support messages, and technical session data needed to operate the platform."),
      createSection("privacy-2", "Why it is used", "This information is used to deliver orders, manage accounts, provide support, improve operations, and protect against misuse."),
      createSection("privacy-3", "Support records", "Messages sent through support channels may be reviewed to resolve issues, confirm delivery, and handle disputes fairly."),
      createSection("privacy-4", "Security", "Reasonable steps are taken to protect account sessions and platform data, but customers should also protect their own passwords and devices."),
      createSection("privacy-5", "Sharing", "Customer information is not meant to be sold casually. It may only be shared when required for service delivery, platform operations, or legal compliance.")
    ]
  },
  {
    slug: "store-faq",
    label: "Store FAQ",
    footerGroup: "policies",
    order: 7,
    eyebrow: "Store FAQ",
    title: "Operational answers for shopping, delivery, and support.",
    description: "Use this page for store-specific questions that customers often ask before buying.",
    body: "",
    layout: "faq",
    sections: [
      createSection("store-faq-1", "How fast are orders delivered?", "Delivery timing depends on the product type. Products with direct access can be fulfilled quickly, while manual items may take longer."),
      createSection("store-faq-2", "Do I need an account to view my purchases?", "Yes. The customer dashboard is the main place to check orders, delivery details, and support updates."),
      createSection("store-faq-3", "Can I contact support before buying?", "Yes. Use the available support channels if you need clarification before placing an order."),
      createSection("store-faq-4", "Will my products stay listed forever?", "Not always. The catalog is owner-managed, so products can be paused, restocked, or updated at any time."),
      createSection("store-faq-5", "What should I do if a product is missing from the catalog?", "Reach out through support channels if you want to ask about availability or a custom restock.")
    ]
  }
];

export const DEFAULT_SUPPORT_CHANNELS: SupportChannelSeed[] = [
  {
    title: "WhatsApp",
    description: "Best for quick pre-sale questions and urgent order follow-up.",
    href: "https://wa.me/917907102615",
    buttonLabel: "Open WhatsApp",
    order: 0,
    active: true
  },
  {
    title: "Telegram",
    description: "Use this for updates, screenshots, and support conversations that need a longer thread.",
    href: "https://t.me/ogdigital",
    buttonLabel: "Open Telegram",
    order: 1,
    active: true
  },
  {
    title: "Dashboard support",
    description: "Signed-in customers can also use the support area inside the account dashboard for tracked requests.",
    href: "/dashboard",
    buttonLabel: "Open dashboard",
    order: 2,
    active: true
  }
];

export function sortSitePages<T extends Pick<SitePage, "order" | "label">>(pages: T[]) {
  return [...pages].sort((a, b) => {
    const orderDiff = Number(a.order || 0) - Number(b.order || 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.label.localeCompare(b.label);
  });
}

export function sortSupportChannels<T extends Pick<SupportChannel, "order" | "title">>(channels: T[]) {
  return [...channels].sort((a, b) => {
    const orderDiff = Number(a.order || 0) - Number(b.order || 0);
    if (orderDiff !== 0) {
      return orderDiff;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getSupportChannelIconType(channel: Pick<SupportChannel, "title" | "href">) {
  const combined = `${channel.title} ${channel.href}`.toLowerCase();
  if (combined.includes("whatsapp") || combined.includes("wa.me")) {
    return "whatsapp";
  }
  if (combined.includes("telegram") || combined.includes("t.me")) {
    return "telegram";
  }
  if (combined.includes("mailto:") || combined.includes("email")) {
    return "mail";
  }
  return "support";
}
