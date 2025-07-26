import BrandProducts from "../../../Components/BrandProducts.jsx";


export async function generateMetadata({ params }) {
  const brandName = params.brandName.replace(/-/g, ' ');
  return {
    title: `${brandName} Products | IC Components Store`,
    description: `Browse ${brandName} integrated circuits and electronic components.`
  };
}

export default function BrandPage({ params }) {
  return <BrandProducts brandName={params.brandName} />;
}