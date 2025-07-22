import ProductDetail from "@/Components/productDetail";

export async function generateMetadata({ params }) {
  const brandName = params.brandName.replace(/-/g, ' ');
  return {
    title: `${params.productId} | ${brandName} | IC Components`,
    description: `Detailed specifications and documentation for ${params.productId} from ${brandName}.`
  };
}

export default function ProductPage({ params }) {
  return (
    <ProductDetail
      brandName={params.brandName} 
      productId={params.productId} 
    />
  );
}
