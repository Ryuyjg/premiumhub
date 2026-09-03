import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug, getProductReviews, getProducts, getRelatedProducts } from "@/lib/db";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const products = await getProducts().catch(() => []);
  return products.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.seoTitle || product?.name || "Product details",
    description: product?.seoDescription || product?.shortDescription
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id).catch(() => []),
    getRelatedProducts(product.categoryId, product.id, 4).catch(() => [])
  ]);

  return (
    <div className="container py-16">
      <ProductDetail product={product} reviews={reviews} relatedProducts={relatedProducts} />
    </div>
  );
}
