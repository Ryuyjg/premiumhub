import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { ProductShowcase } from "@/components/products/product-showcase";
import { getFeaturedProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts().catch(() => []);

  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <ProductShowcase products={featuredProducts} />
      <CtaBanner />
    </>
  );
}
