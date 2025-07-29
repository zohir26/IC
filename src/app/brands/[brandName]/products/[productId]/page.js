// app/brands/[brandName]/products/[productId]/page.js - FIXED for Next.js 15

import ProductDetail from "@/Components/productDetail";


export async function generateMetadata({ params }) {
  const { brandName, productId } = await params; // Await params
  const brandNameFormatted = brandName.replace(/-/g, ' ');
  return {
    title: `${productId} | ${brandNameFormatted} | IC Components`,
    description: `Detailed specifications and documentation for ${productId} from ${brandNameFormatted}.`
  };
}

export default async function ProductPage({ params }) {
  const { brandName, productId } = await params; // Await params
  return (
    <ProductDetail
      brandName={brandName}
      productId={productId}
    />
  );
}