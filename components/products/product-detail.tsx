"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  HeadphonesIcon,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star
} from "lucide-react";
import type { Product, Review } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckoutButton } from "@/components/products/purchase-panel";
import { Badge } from "@/components/ui/badge";

const deliveryModeLabels: Record<string, string> = {
  direct_credentials: "Direct credentials",
  otp_manual: "Manual OTP delivery",
  email_invite: "Invite delivery"
};

const deliveryModeDescriptions: Record<string, string> = {
  direct_credentials: "Access details are organized inside the dashboard once the order clears.",
  otp_manual: "This item needs manual handling after payment before final access is shared.",
  email_invite: "This product uses invite delivery, so enter the email address that should receive access."
};

function getParagraphs(text: string) {
  return text
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function ProductDetail({
  product,
  reviews,
  relatedProducts
}: {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}) {
  const [activeImage, setActiveImage] = useState(product.imageUrls[0]);
  const isOutOfStock = Boolean(product.isOutOfStock);
  const deliveryMode = product.deliveryMode || "direct_credentials";
  const deliveryLabel = deliveryModeLabels[deliveryMode] || "Managed delivery";
  const detailParagraphs = useMemo(() => {
    const paragraphs = getParagraphs(product.description || "");
    if (paragraphs.length) {
      return paragraphs;
    }
    return product.description?.trim() ? [product.description.trim()] : [];
  }, [product.description]);

  const quickFacts = [
    { label: "Category", value: product.categoryName },
    { label: "Access window", value: `${product.durationInDays} days` },
    { label: "Delivery mode", value: deliveryLabel },
    { label: "Availability", value: isOutOfStock ? "No stock" : "Ready to order" }
  ];

  const confidenceNotes = [
    "Clear product details, pricing, duration, and delivery notes are shown before checkout.",
    "Delivery updates and support follow-up stay inside your dashboard after checkout.",
    product.deliveryNotes?.trim() || deliveryModeDescriptions[deliveryMode]
  ];

  const overviewCards = [
    {
      icon: Layers3,
      title: "Product snapshot",
      text: product.shortDescription || "A curated digital product with account-based delivery tracking."
    },
    {
      icon: Clock3,
      title: "Delivery path",
      text: deliveryModeDescriptions[deliveryMode]
    },
    {
      icon: HeadphonesIcon,
      title: "Support after purchase",
      text: "If anything needs clarification after payment, the dashboard and support channels stay available."
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="font-semibold transition-colors hover:text-foreground">
          Catalog
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium">{product.categoryName}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="surface relative aspect-[16/10] overflow-hidden rounded-[2rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0.45, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.3, scale: 0.98 }}
                transition={{ duration: 0.34 }}
                className="absolute inset-0"
              >
                <Image src={activeImage || product.imageUrls[0]} alt={product.name} fill className="bg-black object-contain" />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-foreground/14 blur-3xl" />
          </div>

          <div className="overflow-x-auto pb-1 [scrollbar-width:none]">
            <div className="flex min-w-max gap-3">
              {product.imageUrls.map((image) => (
                <motion.button
                  key={image}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveImage(image)}
                  className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border transition md:h-28 md:w-28 ${
                    activeImage === image
                      ? "border-foreground shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                      : "border-border/70"
                  }`}
                >
                  <Image src={image} alt={product.name} fill className="bg-black object-contain" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {overviewCards.map((item) => (
              <div key={item.title} className="surface rounded-[1.5rem] p-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{product.categoryName}</Badge>
              <span className="inline-flex rounded-full border border-border/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {deliveryLabel}
              </span>
              {product.bestSelling ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Best seller
                </span>
              ) : null}
              {isOutOfStock ? (
                <span className="inline-flex rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300">
                  No stock
                </span>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Curated product page</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{product.name}</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {product.shortDescription || product.description}
              </p>
            </div>
          </div>

          <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.85rem] p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-black">{formatCurrency(product.salePrice || product.price)}</p>
                {product.salePrice ? (
                  <p className="mt-2 text-sm text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                  {product.durationInDays} day access
                </div>
                <div className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                  {reviews.length ? `${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "New listing"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CheckoutButton product={product} />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/12 bg-primary/6 px-4 py-3 text-sm text-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Delivery notes, credentials, and order follow-up stay in the customer dashboard after checkout.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickFacts.map((item) => (
              <div key={item.label} className="surface rounded-[1.5rem] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
            <h2 className="text-lg font-semibold">Buying confidence</h2>
            <div className="mt-5 space-y-3">
              {confidenceNotes.map((note) => (
                <div key={note} className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm leading-7 text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="mt-5 inline-flex text-sm font-semibold text-primary">
              Open support channels
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold">Product overview</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-muted-foreground">
            {detailParagraphs.length ? (
              detailParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>
                This product includes managed delivery, account tracking, and support follow-up after checkout.
              </p>
            )}
          </div>

          {product.deliveryNotes?.trim() ? (
            <div className="mt-6 rounded-[1.4rem] border border-border/70 bg-background/70 p-5">
              <p className="text-sm font-semibold">Delivery note</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{product.deliveryNotes}</p>
            </div>
          ) : null}
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold">What is included</h2>
          <div className="mt-5 grid gap-3">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-[1.35rem] border border-border/70 bg-background/60 p-4">
                <span className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-7 text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Customer reviews</h2>
            <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
          </div>
          <div className="mt-5 space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border/80 bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${review.id}-${index}`}
                        className={`h-3.5 w-3.5 ${index < review.rating ? "fill-current" : ""}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{review.message}</p>
              </div>
            ))}
            {reviews.length === 0 ? (
              <p className="text-sm leading-7 text-muted-foreground">
                Reviews for this product will appear here as verified customer feedback becomes available.
              </p>
            ) : null}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="surface rounded-[1.75rem] p-6">
          <h2 className="text-xl font-semibold">You may also like</h2>
          <p className="mt-1 text-sm text-muted-foreground">More items from the same catalog path.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="rounded-2xl border border-border/80 bg-background/60 p-4 transition hover:border-foreground/18 hover:bg-background/72"
              >
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.shortDescription}</p>
                <p className="mt-3 text-sm font-semibold">{formatCurrency(item.salePrice || item.price)}</p>
              </Link>
            ))}
            {relatedProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Browse the full catalog to discover more digital products.</p>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
