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
    eyebrow: "About",
    title: "About OTT SHOP",
    description: "OTT SHOP is a digital subscription store.",
    body: ["We sell digital plans, software access, game offers, and support-based digital services.", "For help before or after purchase, use the contact channels listed on the Contact page."].join("\n\n"),
    layout: "cards",
    sections: [
      createSection(
        "curated-catalog",
        "Curated catalog",
        "Products are listed with clear pricing, duration, delivery notes, and support details before checkout."
      ),
      createSection(
        "trust-first-delivery",
        "Trust-first delivery",
        "Orders, delivery handling, and customer support stay organized inside the customer account area."
      ),
      createSection(
        "built-to-evolve",
        "Built to evolve",
        "The store is built for a clean buying experience across mobile and desktop."
      )
    ]
  },
  {
    slug: "contact",
    label: "Contact",
    footerGroup: "company",
    order: 1,
    eyebrow: "Contact",
    title: "Contact support",
    description: "Use Telegram or WhatsApp for support.",
    body: ["For faster help, send your order ID with your message."].join("\n\n"),
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
    title: "Frequently asked questions",
    description: "Quick answers about orders, delivery, and support.",
    body: "",
    layout: "faq",
    sections: [
      createSection("faq-1", "What does OTT SHOP sell?", "The storefront is built for curated digital products, software, access plans, and private offers."),
      createSection("faq-2", "How do I choose the right product?", "Open a category, compare the price and duration, then open the product page for full details before adding it to cart."),
      createSection("faq-3", "Where do customers receive delivery details?", "Orders, credentials, invite delivery information, and support updates are meant to appear inside the customer dashboard."),
      createSection("faq-4", "Can products be out of stock?", "Yes. Stock status is managed per product so the store does not sell items that are not ready for delivery."),
      createSection("faq-5", "Do all items deliver the same way?", "No. Some items deliver directly, some require manual handling, and some use invite-based access."),
      createSection("faq-6", "Can I ask before buying?", "Yes. Use WhatsApp, Telegram, or dashboard support if you need help choosing the correct product.")
    ]
  },
  {
    slug: "support-channels",
    label: "Support channels",
    footerGroup: "company",
    order: 3,
    eyebrow: "Support channels",
    title: "Support channels",
    description: "Choose any active support channel below.",
    body: "Share your order ID and product name for faster help.",
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
    title: "Refund policy",
    description: "Refund rules for digital purchases.",
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
    title: "Terms of use",
    description: "Basic terms for using the store and services.",
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
    title: "Privacy policy",
    description: "How we collect and use information.",
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
    title: "Store FAQ",
    description: "Store-related questions and answers.",
    body: "",
    layout: "faq",
    sections: [
      createSection("store-faq-1", "How fast are orders delivered?", "Delivery timing depends on the product type. Products with direct access can be fulfilled quickly, while manual items may take longer."),
      createSection("store-faq-2", "Do I need an account to view my purchases?", "Yes. The customer dashboard is the main place to check orders, delivery details, and support updates."),
      createSection("store-faq-3", "Can I contact support before buying?", "Yes. Use the available support channels if you need clarification before placing an order."),
      createSection("store-faq-4", "Can product availability change?", "Yes. Digital product availability can change based on stock, delivery capacity, or service updates."),
      createSection("store-faq-5", "What should I do if a product is missing from the catalog?", "Reach out through support channels if you want to ask about availability or a custom restock.")
    ]
  }
];

export const DEFAULT_SUPPORT_CHANNELS: SupportChannelSeed[] = [
  {
    title: "WhatsApp",
    description: "Message support directly on WhatsApp.",
    href: "https://wa.me/917012958322",
    buttonLabel: "Open WhatsApp",
    order: 0,
    active: true
  },
  {
    title: "Telegram",
    description: "Message @ogdigital on Telegram.",
    href: "https://t.me/ogdigital",
    buttonLabel: "Open Telegram",
    order: 1,
    active: true
  },
  {
    title: "Dashboard support",
    description: "Signed-in customers can open tracked support chats inside their account dashboard.",
    href: "/dashboard#support-center",
    buttonLabel: "Open dashboard support",
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
