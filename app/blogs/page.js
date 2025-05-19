import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function BlogsPage() {
  const blogs = [
    {
      id: 1,
      title: "Choosing the Right Baby Clothes for Every Season",
      excerpt: "Learn how to select the perfect baby clothes that keep your little one comfortable throughout the year.",
      date: "May 15, 2024",
      readTime: "7 min read",
      author: "Dr. Sarah Johnson",
      image: "/products/1.jpg",
      category: "Baby Clothing"
    },
    {
      id: 2,
      title: "Essential Baby Care Products for New Parents",
      excerpt: "Discover the must-have baby care products that every new parent should have in their nursery.",
      date: "April 28, 2024",
      readTime: "5 min read",
      author: "Nishimatsuya Team",
      image: "/products/2.jpg",
      category: "Baby Care"
    },
    {
      id: 3,
      title: "The Importance of Safe Baby Toys for Development",
      excerpt: "Understanding how safe, age-appropriate toys contribute to your baby's cognitive and motor skills development.",
      date: "April 10, 2024",
      readTime: "6 min read",
      author: "Michael Chen",
      image: "/products/3.jpeg",
      category: "Baby Toys"
    },
    {
      id: 4,
      title: "Creating a Cozy Nursery with the Right Furniture",
      excerpt: "Tips and tricks for selecting baby furniture that's both functional and creates a warm environment for your newborn.",
      date: "March 22, 2024",
      readTime: "4 min read",
      author: "Emma Wilson",
      image: "/products/4.webp",
      category: "Baby Furniture"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-200 to-pink-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-pink-800">Nishimatsuya Baby Blog</h1>
          <p className="text-xl text-pink-700">Expert advice and tips for parents and caregivers</p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-pink-100">
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={blog.image} 
                  alt={blog.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-pink-800 hover:text-pink-600 transition-colors">
                  <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
                </h2>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-pink-500" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-1 text-pink-500" />
                    <span>{blog.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-pink-200 py-12 border-t border-pink-300">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-pink-800 text-center">Stay Updated with Baby Care Tips</h2>
            <p className="mb-6 text-center text-pink-700">Subscribe to our newsletter for the latest parenting advice, product updates, and exclusive offers.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg border border-pink-200 flex-grow focus:border-pink-500 focus:ring-pink-500"
              />
              <button className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}