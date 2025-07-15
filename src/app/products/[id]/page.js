"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link 
                href={`/products/category/${product.category}`} 
                className="text-gray-500 hover:text-gray-700 capitalize"
              >
                {product.category.replace(/-/g, ' ')}
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <img 
              src={product.image || '/placeholder-product.png'} 
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <p className="text-2xl font-semibold text-green-600">
                ${product.price?.toFixed(2)}
              </p>
              <p className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                product.availability === 'In Stock' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.availability}
              </p>
            </div>

            {/* Key Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Brand</span>
                <Link 
                  href={`/products/brand/${product.brand}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.brandName}
                </Link>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Manufacturer</span>
                <Link 
                  href={`/products/manufacturer/${product.manufacturer}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.manufacturerName}
                </Link>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Category</span>
                <span className="capitalize">{product.category.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Type</span>
                <span className="capitalize">{product.type?.replace(/-/g, ' ')}</span>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Add to Cart
              </button>
              {product.datasheet && (
                <a 
                  href={product.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Datasheet
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="py-3 border-b">
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {product.applications && product.applications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Applications</h2>
            <ul className="list-disc list-inside space-y-2">
              {product.applications.map((app, index) => (
                <li key={index} className="text-gray-700">{app}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}