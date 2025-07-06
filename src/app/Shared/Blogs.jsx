'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Clock, Eye, X, User, Calendar, Tag } from 'lucide-react';

const Blogs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogsData, setBlogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs data from JSON file
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/blogs.json');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs data');
        }
        const data = await response.json();
        setBlogsData(data.blogs || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Responsive cards per view
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2;  // md
      return 1; // sm
    }
    return 3;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());

  React.useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + cardsPerView >= blogsData.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, blogsData.length - cardsPerView) : prev - 1
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Basics': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'History': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'Design': 'bg-gradient-to-br from-green-500 to-green-600',
      'Manufacturing': 'bg-gradient-to-br from-orange-500 to-orange-600',
      'Applications': 'bg-gradient-to-br from-pink-500 to-pink-600',
      'Emerging Tech': 'bg-gradient-to-br from-red-500 to-red-600',
      'Memory': 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'Wireless': 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'Quality': 'bg-gradient-to-br from-teal-500 to-teal-600',
      'Future Tech': 'bg-gradient-to-br from-cyan-500 to-cyan-600'
    };
    return colors[category] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  const BlogCard = ({ blog, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
      onClick={() => setSelectedBlog(blog)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.img || `https://picsum.photos/400/300?random=${blog.id}`}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(blog.category)}`}>
          {blog.category}
        </div>
        {blog.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <User size={16} />
          <span className="text-sm">{blog.author}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.summary}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{blog.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{blog.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const BlogDetailModal = ({ blog, onClose }) => (
    <AnimatePresence>
      {blog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={blog.img || `https://picsum.photos/800/400?random=${blog.id}`}
                alt={blog.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
              <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full text-white font-medium ${getCategoryColor(blog.category)}`}>
                {blog.category}
              </div>
            </div>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
              
              <div className="flex items-center gap-6 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{blog.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6 font-medium">{blog.summary}</p>
                <div className="text-gray-600 leading-relaxed">
                  {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <h3 className="font-bold mb-2">Error Loading Blogs</h3>
              <p>{error}</p>
              <p className="text-sm mt-2">Make sure your blogs.json file is in the public directory.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No blogs found
  if (blogsData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No blogs found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Latest <span className="text-blue-600">Tech Blogs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the fascinating world of integrated circuits and semiconductor technology
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden px-16">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {blogsData.map((blog, index) => (
                <div
                  key={blog.id}
                  className={`flex-shrink-0 px-4 ${
                    cardsPerView === 3 ? 'w-1/3' : 
                    cardsPerView === 2 ? 'w-1/2' : 'w-full'
                  }`}
                >
                  <BlogCard blog={blog} index={index} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(blogsData.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  Math.floor(currentIndex / cardsPerView) === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Blog Detail Modal */}
        <BlogDetailModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      </div>
    </div>
  );
};

export default Blogs;