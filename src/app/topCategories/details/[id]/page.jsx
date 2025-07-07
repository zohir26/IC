"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function CategoryDetails() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!params.id) {
        setLoading(false);
        setError('Category ID is missing.');
        return;
      }

      try {
        const response = await fetch('/categories.json');
        if (!response.ok) {
          throw new Error('Failed to fetch category details');
        }
        const data = await response.json();
        const foundCategory = data.find(cat => cat.id.toString() === params.id);
        
        if (!foundCategory) {
          throw new Error('Category not found');
        }
        
        setCategory(foundCategory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/categories" className="text-gray-500 hover:text-gray-700">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Categories
          </button>
          
          <div className="flex items-center gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src={category.icon} 
                alt={category.name}
                className="w-20 h-20"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
              <p className="text-blue-100">Comprehensive information and resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                {category.details.description}
              </p>
            </div>

            {/* Applications Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {category.details.applications.map((app, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="space-y-4">
                {category.details.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Info Card */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Market Information</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {category.details.marketInfo}
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link 
                  href={category.link}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Browse Products</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
                <Link 
                  href="/resources"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Technical Resources</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
                <Link 
                  href="/contact"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-blue-600">Get Support</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Help Choosing?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Our experts can help you find the right components for your project.
              </p>
              <button
                onClick={() => router.push('/contact')}
                className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact an Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}