import Link from 'next/link';

// This function fetches data on the server side.
async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs`, {
    cache: 'no-store', // Ensures fresh data on every request
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }
  
  const data = await res.json();
  return data.blogs;
}

// The main page component for displaying all blogs.
export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-400">The IC Insider Blog</h1>
          <p className="text-lg text-gray-400 mt-2">Your source for the latest in integrated circuit technology.</p>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <div className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300 h-full flex flex-col">
                <img src={blog.img} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-sm text-cyan-400 font-semibold">{blog.category.toUpperCase()}</p>
                  <h2 className="text-xl font-bold mt-2 mb-3 flex-grow">{blog.title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{blog.summary}</p>
                  <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <span>By {blog.author}</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}