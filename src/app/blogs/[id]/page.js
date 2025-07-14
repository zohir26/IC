import Link from 'next/link';

// Fetches a single blog by its ID on the server.
async function getBlogById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will be caught by the error.js boundary
    throw new Error('Failed to fetch blog');
  }
  
  const data = await res.json();
  return data.blog;
}

// The page component for displaying a single blog.
export default async function BlogPostPage({ params }) {
  const { id } = params;
  const blog = await getBlogById(id);

  if (!blog) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">Blog Not Found</h1>
          <p className="mt-4 text-gray-400">The blog post you are looking for does not exist.</p>
          <Link href="/blogs" className="mt-6 inline-block bg-cyan-500 text-white font-bold py-2 px-4 rounded hover:bg-cyan-600">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          <header className="mb-8">
            <Link href="/blogs" className="text-cyan-400 hover:underline mb-4 inline-block">&larr; Back to all blogs</Link>
            <p className="text-base text-gray-400">{blog.category.toUpperCase()} &bull; {new Date(blog.publishDate).toLocaleDateString()}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{blog.title}</h1>
            <div className="mt-4 flex items-center text-gray-400 text-sm">
              <span>By {blog.author}</span>
              <span className="mx-2">&bull;</span>
              <span>{blog.readTime}</span>
              <span className="mx-2">&bull;</span>
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </header>

          <img src={blog.img} alt={blog.title} className="w-full rounded-lg mb-8" />

          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p className="lead text-xl">{blog.summary}</p>
            <p>{blog.content}</p>
          </div>
          
          <footer className="mt-12 pt-6 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span key={tag} className="bg-gray-700 text-cyan-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}