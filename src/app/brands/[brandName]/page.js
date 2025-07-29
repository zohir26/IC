// app/brands/[brandName]/page.js - FIXED for Next.js 15
import BrandProducts from '@/components/BrandProducts';

export async function generateMetadata({ params }) {
  const { brandName } = await params; // Await params
  const brandNameFormatted = brandName.replace(/-/g, ' ');
  return {
    title: `${brandNameFormatted} Products | IC Components Store`,
    description: `Browse ${brandNameFormatted} integrated circuits and electronic components.`
  };
}

export default async function BrandPage({ params }) {
  const { brandName } = await params; // Await params
  return <BrandProducts brandName={brandName} />;
}