export type UserRole = "user" | "admin";

export type SitePageLayout = "cards" | "faq" | "policy" | "rules";
export type SiteFooterGroup = "company" | "policies";

export type SitePageSection = {
  id: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
};

export type SitePage = {
  id: string;
  slug: string;
  label: string;
  footerGroup: SiteFooterGroup;
  order: number;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  layout: SitePageLayout;
  showSupportChannels?: boolean;
  sections: SitePageSection[];
  createdAt?: string;
  updatedAt?: string;
};

export type SupportChannel = {
  id: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  order: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  featured?: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  categoryName: string;
  durationInDays: number;
  imageUrls: string[];
  features: string[];
  featured?: boolean;
  bestSelling?: boolean;
  stockStatus: "active" | "draft" | "archived";
  deliveryMode?: "direct_credentials" | "otp_manual" | "email_invite";
  otpSupportNumber?: string;
  deliveryNotes?: string;
  isOutOfStock?: boolean;
  stockCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  accent?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  message: string;
  active: boolean;
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "flat" | "percent";
  value: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
};

export type OrderStatus = "created" | "paid" | "failed" | "refunded";

export type Order = {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productSlug: string;
  amount: number;
  status: OrderStatus;
  gatewayOrderId?: string | null;
  gatewayPaymentId?: string;
  paymentMethod?: "wallet" | "crypto" | "manual";
  walletDeducted?: number;
  deliveryMode?: "direct_credentials" | "otp_manual" | "email_invite";
  customerDeliveryEmail?: string;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    device?: string;
  };
};

export type Subscription = {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  productName: string;
  status: "active" | "expired" | "cancelled";
  startsAt: string;
  expiresAt: string;
  ottAccountId?: string;
  assignedCredentialLabel?: string;
  deliveryMode?: "direct_credentials" | "otp_manual" | "email_invite";
  otpSupportNumber?: string;
  customerDeliveryEmail?: string;
  deliveryNotes?: string;
};

export type OttAccount = {
  id: string;
  productId: string;
  provider: string;
  emailCiphertext: string;
  passwordCiphertext: string;
  maxUsers: number;
  activeUsers: number;
  label: string;
  status: "available" | "full" | "disabled";
};

export type AppUser = {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  walletBalance?: number;
  createdAt?: string;
  suspended?: boolean;
};

export type SupportTicket = {
  id: string;
  userId: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  messages?: SupportMessage[];
  lastMessageAt?: string;
  createdAt: string;
  updatedAt?: string;
};

export type SupportMessage = {
  id: string;
  sender: "user" | "admin";
  body: string;
  email?: string;
  createdAt: string;
};

export type UserNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type AnalyticsSummary = {
  revenue: number;
  orders: number;
  activeUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: Array<{ label: string; value: number }>;
};
