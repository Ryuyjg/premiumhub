import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { TelegramFeatureSection } from "@/components/marketing/telegram-feature-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { ProductShowcase } from "@/components/products/product-showcase";
import { FEATURED_CATEGORY_SLUG } from "@/lib/catalog";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, allProducts, categories] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getProducts().catch(() => []),
    getCategories().catch(() => [])
  ]);
  const telegramCategory = categories.find((item) => item.slug === FEATURED_CATEGORY_SLUG) || null;
  const telegramProducts = telegramCategory
    ? allProducts.filter((product) => product.categoryId === telegramCategory.id)
    : [];

  return (
    <>
      <HeroSection products={allProducts} />
      <TelegramFeatureSection category={telegramCategory} products={telegramProducts} />
      <FeatureGrid />
      <TrustSection />
      <ProductShowcase products={featuredProducts} />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
