export type StarterCategory = {
  name: string;
  description: string;
};

export type StarterProduct = {
  name: string;
  categoryName: string;
  description: string;
  price: number;
  salePrice?: number;
  durationInDays: number;
  imageUrl: string;
  featured?: boolean;
  bestSelling?: boolean;
  deliveryMode?: "direct_credentials" | "otp_manual" | "email_invite";
  features?: string[];
};

export const STARTER_CATEGORIES: StarterCategory[] = [
  { name: "OTT Streaming", description: "Popular streaming plans and entertainment subscriptions." },
  { name: "AI Tools", description: "AI chat, image, and productivity assistants." },
  { name: "Design and Creative", description: "Design, editing, and creator software plans." },
  { name: "Productivity", description: "Office, writing, and daily productivity subscriptions." },
  { name: "Developer", description: "Developer-focused coding and build tool subscriptions." },
  { name: "Gaming", description: "Game passes, memberships, and gaming bundles." },
  { name: "Music and Audio", description: "Music and audio streaming subscriptions." },
  { name: "Security and VPN", description: "VPN and security software subscriptions." },
  { name: "Cloud Storage", description: "Cloud backup and storage products." },
  { name: "Social and Marketing", description: "Social growth and marketing tool subscriptions." },
  { name: "Virtual Numbers", description: "OTP activation and virtual number products." },
  { name: "Education and Learning", description: "Learning platform and skill development plans." }
];

const F = {
  instant: ["Fast delivery", "Secure checkout", "Support included"],
  pro: ["Premium plan", "Priority support", "Simple renewal"],
  number: ["OTP assistance", "Manual support", "Quick activation"]
};

export const STARTER_PRODUCTS: StarterProduct[] = [
  { name: "Netflix 4K Premium", categoryName: "OTT Streaming", description: "Premium Netflix access for high-quality streaming.", price: 499, salePrice: 399, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?netflix,streaming", featured: true, bestSelling: true, deliveryMode: "email_invite", features: F.instant },
  { name: "Disney+ Hotstar Super", categoryName: "OTT Streaming", description: "Watch movies, sports, and originals on Hotstar.", price: 399, salePrice: 299, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?disney,streaming", deliveryMode: "email_invite", features: F.instant },
  { name: "Prime Video Annual", categoryName: "OTT Streaming", description: "Amazon Prime Video annual entertainment bundle.", price: 1499, salePrice: 1199, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?prime,video", deliveryMode: "email_invite", features: F.pro },
  { name: "SonyLIV Premium", categoryName: "OTT Streaming", description: "SonyLIV premium plan for sports and shows.", price: 699, salePrice: 549, durationInDays: 90, imageUrl: "https://source.unsplash.com/1600x900/?sport,streaming", deliveryMode: "email_invite", features: F.instant },
  { name: "ZEE5 Premium", categoryName: "OTT Streaming", description: "ZEE5 premium subscription with ad-free access.", price: 599, salePrice: 449, durationInDays: 90, imageUrl: "https://source.unsplash.com/1600x900/?cinema,ott", deliveryMode: "email_invite", features: F.instant },

  { name: "ChatGPT Plus Shared", categoryName: "AI Tools", description: "Affordable ChatGPT Plus access for daily AI usage.", price: 899, salePrice: 699, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?ai,chatbot", featured: true, bestSelling: true, deliveryMode: "email_invite", features: F.pro },
  { name: "Claude Pro Shared", categoryName: "AI Tools", description: "Claude Pro access for advanced writing and coding support.", price: 899, salePrice: 749, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?ai,assistant", deliveryMode: "email_invite", features: F.pro },
  { name: "Midjourney Standard", categoryName: "AI Tools", description: "Generate high-quality AI images with Midjourney.", price: 1299, salePrice: 999, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?ai,art", deliveryMode: "email_invite", features: F.pro },
  { name: "Perplexity Pro", categoryName: "AI Tools", description: "Research-focused AI answer engine subscription.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?search,ai", deliveryMode: "email_invite", features: F.instant },
  { name: "Gemini Advanced", categoryName: "AI Tools", description: "Gemini advanced AI plan for productivity and content.", price: 1099, salePrice: 899, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?google,ai", deliveryMode: "email_invite", features: F.pro },

  { name: "Adobe Creative Cloud", categoryName: "Design and Creative", description: "Creative Cloud plan for design and video creators.", price: 2399, salePrice: 1799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?adobe,design", featured: true, deliveryMode: "email_invite", features: F.pro },
  { name: "Canva Pro", categoryName: "Design and Creative", description: "Canva Pro tools for social and marketing creatives.", price: 699, salePrice: 499, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?canva,design", bestSelling: true, deliveryMode: "email_invite", features: F.instant },
  { name: "CapCut Pro", categoryName: "Design and Creative", description: "CapCut premium effects and editing features.", price: 599, salePrice: 449, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?video,editing", deliveryMode: "email_invite", features: F.instant },
  { name: "Figma Pro", categoryName: "Design and Creative", description: "Collaborative Figma Pro workspace plan.", price: 899, salePrice: 749, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?figma,ui", deliveryMode: "email_invite", features: F.pro },
  { name: "Envato Elements", categoryName: "Design and Creative", description: "Unlimited creative assets for creators and agencies.", price: 1199, salePrice: 899, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?templates,design", deliveryMode: "email_invite", features: F.pro },

  { name: "Microsoft 365 Family", categoryName: "Productivity", description: "Office apps with cloud storage for teams and families.", price: 1499, salePrice: 1199, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?office,productivity", featured: true, deliveryMode: "email_invite", features: F.pro },
  { name: "Notion Plus", categoryName: "Productivity", description: "Organize notes, docs, and workflows with Notion Plus.", price: 599, salePrice: 449, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?notion,workspace", deliveryMode: "email_invite", features: F.instant },
  { name: "Grammarly Premium", categoryName: "Productivity", description: "Grammar and writing enhancement for professionals.", price: 799, salePrice: 599, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?writing,keyboard", deliveryMode: "email_invite", features: F.instant },
  { name: "Todoist Pro", categoryName: "Productivity", description: "Task planning and team productivity suite.", price: 499, salePrice: 349, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?task,planning", deliveryMode: "email_invite", features: F.instant },
  { name: "WPS Office Premium", categoryName: "Productivity", description: "Document editing suite with premium features.", price: 699, salePrice: 549, durationInDays: 90, imageUrl: "https://source.unsplash.com/1600x900/?documents,office", deliveryMode: "email_invite", features: F.instant },

  { name: "GitHub Copilot", categoryName: "Developer", description: "AI coding assistant for faster software development.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?github,coding", bestSelling: true, deliveryMode: "email_invite", features: F.pro },
  { name: "JetBrains All Products", categoryName: "Developer", description: "Access major JetBrains IDEs in one subscription.", price: 1899, salePrice: 1499, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?developer,code", deliveryMode: "email_invite", features: F.pro },
  { name: "Replit Core", categoryName: "Developer", description: "Cloud development environment with premium limits.", price: 799, salePrice: 649, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?replit,programming", deliveryMode: "email_invite", features: F.instant },
  { name: "Cursor Pro", categoryName: "Developer", description: "AI-first coding editor plan for modern dev workflows.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?code,editor", deliveryMode: "email_invite", features: F.pro },
  { name: "Vercel Pro", categoryName: "Developer", description: "Deploy and scale frontend projects on Vercel.", price: 1599, salePrice: 1299, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?cloud,deploy", deliveryMode: "email_invite", features: F.pro },

  { name: "Xbox Game Pass Ultimate", categoryName: "Gaming", description: "Access a huge game library with online perks.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?xbox,gaming", featured: true, deliveryMode: "email_invite", features: F.pro },
  { name: "PlayStation Plus Deluxe", categoryName: "Gaming", description: "PS Plus premium gaming membership plan.", price: 1199, salePrice: 949, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?playstation,gaming", deliveryMode: "email_invite", features: F.pro },
  { name: "Minecraft Java Edition", categoryName: "Gaming", description: "Minecraft Java key for PC players.", price: 799, salePrice: 599, durationInDays: 3650, imageUrl: "https://source.unsplash.com/1600x900/?minecraft,game", bestSelling: true, deliveryMode: "email_invite", features: F.instant },
  { name: "EA Play Pro", categoryName: "Gaming", description: "EA premium subscription for exclusive game access.", price: 899, salePrice: 699, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?ea,games", deliveryMode: "email_invite", features: F.instant },
  { name: "Steam Wallet 1000 INR", categoryName: "Gaming", description: "Steam wallet recharge code for game purchases.", price: 1000, salePrice: 950, durationInDays: 3650, imageUrl: "https://source.unsplash.com/1600x900/?steam,gaming", deliveryMode: "email_invite", features: F.instant },

  { name: "Spotify Premium", categoryName: "Music and Audio", description: "Ad-free music streaming and offline playback.", price: 299, salePrice: 199, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?spotify,music", bestSelling: true, deliveryMode: "email_invite", features: F.instant },
  { name: "YouTube Music Premium", categoryName: "Music and Audio", description: "Background play and ad-free YouTube Music.", price: 249, salePrice: 179, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?youtube,music", deliveryMode: "email_invite", features: F.instant },
  { name: "JioSaavn Pro", categoryName: "Music and Audio", description: "JioSaavn premium for high-quality audio streaming.", price: 199, salePrice: 149, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?headphones,music", deliveryMode: "email_invite", features: F.instant },
  { name: "Apple Music Individual", categoryName: "Music and Audio", description: "Apple Music access for uninterrupted listening.", price: 349, salePrice: 279, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?apple,music", deliveryMode: "email_invite", features: F.instant },
  { name: "SoundCloud Go Plus", categoryName: "Music and Audio", description: "SoundCloud premium listening and downloads.", price: 399, salePrice: 299, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?audio,wave", deliveryMode: "email_invite", features: F.instant },

  { name: "NordVPN Premium", categoryName: "Security and VPN", description: "Secure browsing and geo-unblocking with NordVPN.", price: 899, salePrice: 699, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?vpn,security", featured: true, deliveryMode: "email_invite", features: F.pro },
  { name: "ExpressVPN", categoryName: "Security and VPN", description: "Fast and secure VPN service for all devices.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?internet,privacy", deliveryMode: "email_invite", features: F.pro },
  { name: "Bitdefender Total Security", categoryName: "Security and VPN", description: "Comprehensive antivirus and device security suite.", price: 1199, salePrice: 899, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?cybersecurity,antivirus", deliveryMode: "email_invite", features: F.pro },
  { name: "Malwarebytes Premium", categoryName: "Security and VPN", description: "Malware protection and system cleanup subscription.", price: 799, salePrice: 599, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?security,software", deliveryMode: "email_invite", features: F.instant },
  { name: "1Password Family", categoryName: "Security and VPN", description: "Password manager plan for family account security.", price: 899, salePrice: 699, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?password,security", deliveryMode: "email_invite", features: F.pro },

  { name: "Google One 2TB", categoryName: "Cloud Storage", description: "Google cloud storage plan with 2TB space.", price: 799, salePrice: 649, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?cloud,storage", deliveryMode: "email_invite", features: F.instant },
  { name: "Dropbox Plus", categoryName: "Cloud Storage", description: "Dropbox Plus account for personal file storage.", price: 899, salePrice: 749, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?dropbox,files", deliveryMode: "email_invite", features: F.instant },
  { name: "iCloud Plus 2TB", categoryName: "Cloud Storage", description: "Apple iCloud Plus 2TB storage subscription.", price: 799, salePrice: 649, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?icloud,apple", deliveryMode: "email_invite", features: F.instant },
  { name: "Mega Pro Lite", categoryName: "Cloud Storage", description: "Encrypted cloud storage with Mega Pro Lite.", price: 699, salePrice: 549, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?backup,cloud", deliveryMode: "email_invite", features: F.instant },
  { name: "pCloud Premium", categoryName: "Cloud Storage", description: "Secure cloud storage and sharing features.", price: 799, salePrice: 599, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?server,storage", deliveryMode: "email_invite", features: F.instant },

  { name: "LinkedIn Premium Business", categoryName: "Social and Marketing", description: "LinkedIn premium tools for networking and hiring.", price: 1299, salePrice: 999, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?linkedin,business", deliveryMode: "email_invite", features: F.pro },
  { name: "X Premium Plus", categoryName: "Social and Marketing", description: "X premium features for creator and business use.", price: 999, salePrice: 799, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?social,media", deliveryMode: "email_invite", features: F.pro },
  { name: "Telegram Premium", categoryName: "Social and Marketing", description: "Telegram premium account benefits and boosts.", price: 399, salePrice: 299, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?telegram,chat", bestSelling: true, deliveryMode: "email_invite", features: F.instant },
  { name: "YouTube Premium", categoryName: "Social and Marketing", description: "Ad-free YouTube and background play benefits.", price: 399, salePrice: 299, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?youtube,creator", deliveryMode: "email_invite", features: F.instant },
  { name: "Buffer Essentials", categoryName: "Social and Marketing", description: "Social scheduling and publishing workflow tools.", price: 699, salePrice: 549, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?marketing,content", deliveryMode: "email_invite", features: F.pro },

  { name: "WhatsApp Virtual Number", categoryName: "Virtual Numbers", description: "Virtual number setup support for WhatsApp activation.", price: 299, salePrice: 229, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?whatsapp,phone", deliveryMode: "otp_manual", features: F.number },
  { name: "Telegram Virtual Number", categoryName: "Virtual Numbers", description: "Virtual number support for Telegram verification.", price: 249, salePrice: 199, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?telegram,number", deliveryMode: "otp_manual", features: F.number },
  { name: "SMS Activation Global", categoryName: "Virtual Numbers", description: "Global SMS activation product for app verifications.", price: 349, salePrice: 279, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?sms,mobile", deliveryMode: "otp_manual", features: F.number },
  { name: "USA Verification Number", categoryName: "Virtual Numbers", description: "US virtual number for OTP and app activations.", price: 399, salePrice: 319, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?usa,phone", deliveryMode: "otp_manual", features: F.number },
  { name: "UK OTP Number", categoryName: "Virtual Numbers", description: "UK region virtual number with OTP support.", price: 399, salePrice: 319, durationInDays: 30, imageUrl: "https://source.unsplash.com/1600x900/?uk,phone", deliveryMode: "otp_manual", features: F.number },

  { name: "Coursera Plus", categoryName: "Education and Learning", description: "Unlimited access to Coursera courses and certificates.", price: 1799, salePrice: 1399, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?online,learning", deliveryMode: "email_invite", features: F.pro },
  { name: "Udemy Business", categoryName: "Education and Learning", description: "Udemy premium learning access for professionals.", price: 1499, salePrice: 1199, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?udemy,education", deliveryMode: "email_invite", features: F.pro },
  { name: "Skillshare Premium", categoryName: "Education and Learning", description: "Creative and business learning with Skillshare.", price: 999, salePrice: 749, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?skillshare,creative", deliveryMode: "email_invite", features: F.instant },
  { name: "Duolingo Super", categoryName: "Education and Learning", description: "Language learning subscription with extra features.", price: 699, salePrice: 549, durationInDays: 180, imageUrl: "https://source.unsplash.com/1600x900/?language,learning", deliveryMode: "email_invite", features: F.instant },
  { name: "MasterClass Annual", categoryName: "Education and Learning", description: "Annual access to MasterClass expert-led content.", price: 1699, salePrice: 1399, durationInDays: 365, imageUrl: "https://source.unsplash.com/1600x900/?masterclass,education", deliveryMode: "email_invite", features: F.pro }
];
