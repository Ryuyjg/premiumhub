export type UserRole = "user" | "admin";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  accent?: string;
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
  stockStatus: "active" | "draft" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
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
  razorpayOrderId: string;
  razorpayPaymentId?: string;
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
  createdAt?: string;
};

export type AnalyticsSummary = {
  revenue: number;
  orders: number;
  activeUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: Array<{ label: string; value: number }>;
};
