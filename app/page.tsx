import { CtaBanner } from "@/components/marketing/cta-banner";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { ProductShowcase } from "@/components/products/product-showcase";
import { getFeaturedProducts, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getProducts().catch(() => [])
  ]);

  return (
    <>
      <HeroSection products={allProducts} />
      <FeatureGrid />
      <ProductShowcase products={featuredProducts} />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
