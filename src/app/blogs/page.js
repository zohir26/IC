'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), { ssr: false });

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.blogs || data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getBlogs();
      setBlogs(result);
      setIsClient(true);
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: blogs.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!isClient || blogs.length === 0) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">No blogs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-400">The IC Insider Blog</h1>
          <p className="text-lg text-gray-400 mt-2">
            Your source for the latest in integrated circuit technology.
          </p>
        </header>

        {/* Single Carousel for All Blogs */}
        <div className="mb-12">
          <Slider {...sliderSettings}>
            {blogs.map((blog) => {
              const id = blog._id || blog.id;
              return (
                <div key={id} className="px-3">
                  <Link href={`/blogs/${id}`}>
                    <div className="bg-gray-800 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition h-full flex flex-col overflow-hidden">
                      <img
                        src={blog.img}
                        alt={blog.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-6 flex flex-col flex-grow">
                        <p className="text-sm text-cyan-400">
                          {blog.category?.toUpperCase()}
                        </p>
                        <h2 className="text-xl font-bold mt-2 mb-3 flex-grow">
                          {blog.title}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4">{blog.summary}</p>
                        <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                          <span>By {blog.author}</span>
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>

        {/* All Blogs Button */}
        <div className="text-center mt-10">
          <Link href="/blogs">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
              All Blogs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
