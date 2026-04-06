import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/products/product-detail";
import { getProductBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.seoTitle || product?.name || "Plan details",
    description: product?.seoDescription || product?.shortDescription
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-16">
      <ProductDetail product={product} />
    </div>
  );
}
