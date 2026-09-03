import { HeroSection } from "@/components/marketing/hero-section";
import { ProductShowcase } from "@/components/products/product-showcase";
import { getFeaturedProducts, getProducts } from "@/lib/db";

export const dynamic = "force-static";

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getProducts().catch(() => [])
  ]);

  return (
    <>
      <HeroSection products={allProducts} />
      <ProductShowcase products={featuredProducts} />
    </>
  );
}
