import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
const blogs = [
  {
    id: 1,
    title: "Choosing the Right Baby Clothes for Every Season",
    content: [
      "Dressing your baby appropriately for each season is crucial for their comfort and health. In summer, opt for lightweight, breathable fabrics like cotton that allow air circulation and prevent overheating. Look for clothes with UPF protection for outdoor activities.",
      "For winter, layering is key. Start with a soft onesie as a base layer, add a warm sweater or cardigan, and finish with a weather-appropriate outer layer. Don't forget mittens and hats to protect extremities from the cold.",
      "During transitional seasons like spring and fall, versatile pieces that can be layered or removed as temperatures change throughout the day are ideal. Always check the weather forecast and dress your baby accordingly.",
      "Remember that babies regulate temperature differently than adults, so it's better to slightly underdress than overdress them. Check their neck or back to gauge if they're too hot or cold."
    ],
    date: "May 15, 2024",
    readTime: "7 min read",
    author: "Dr. Sarah Johnson",
    image: "/products/1.jpg",
    category: "Baby Clothing"
  },
  {
    id: 2,
    title: "Essential Baby Care Products for New Parents",
    content: [
      "Becoming a new parent can be overwhelming, especially when faced with countless product options. Here are the essential baby care products you'll need:",
      "1. Diapering: Stock up on diapers (consider both disposable and cloth options), wipes, diaper rash cream, and a changing pad. A diaper pail can help contain odors.",
      "2. Bathing: You'll need a gentle baby shampoo and body wash, soft washcloths, a baby bathtub with a non-slip surface, and hooded towels for after-bath snuggles.",
      "3. Grooming: Invest in a baby grooming kit with nail clippers, a soft brush, and a nasal aspirator. Baby-safe moisturizer can help with dry skin.",
      "4. Health: Have a digital thermometer, baby-safe sunscreen (for infants over 6 months), and basic first aid supplies on hand.",
      "Remember that every baby is different, so you may need to try a few products before finding what works best for your little one."
    ],
    date: "April 28, 2024",
    readTime: "5 min read",
    author: "Nishimatsuya Team",
    image: "/products/2.jpg",
    category: "Baby Care"
  },
  {
    id: 3,
    title: "The Importance of Safe Baby Toys for Development",
    content: [
      "Toys play a vital role in your baby's development, but safety should always come first. Here's what to consider when selecting toys:",
      "Age-appropriateness: Always check the recommended age range on toys. Toys for infants should be free of small parts that could pose choking hazards.",
      "Material safety: Look for toys made from non-toxic materials. For teething toys, ensure they're BPA-free and phthalate-free.",
      "Developmental benefits: Different toys support different developmental areas. High-contrast toys stimulate vision in newborns, rattles encourage grasping skills, and soft blocks help with hand-eye coordination.",
      "Maintenance: Choose toys that are easy to clean, as babies put everything in their mouths. Regularly inspect toys for wear and tear that could create hazards.",
      "Remember that the best toys are often the simplest ones that encourage interaction between you and your baby."
    ],
    date: "April 10, 2024",
    readTime: "6 min read",
    author: "Michael Chen",
    image: "/products/3.jpeg",
    category: "Baby Toys"
  },
  {
    id: 4,
    title: "Creating a Cozy Nursery with the Right Furniture",
    content: [
      "Designing your baby's nursery is an exciting project, but functionality should guide your furniture choices. Here are key pieces to consider:",
      "Crib: The centerpiece of the nursery should meet current safety standards with slats no more than 2-3/8 inches apart. Consider convertible cribs that grow with your child.",
      "Changing table: Look for one with safety rails and ample storage. Many dressers can double as changing tables with the addition of a pad.",
      "Rocking chair or glider: Essential for those late-night feedings. Choose one with good back support and consider an ottoman for added comfort.",
      "Storage solutions: Open shelving keeps essentials within reach while closed storage hides clutter. Consider baskets for easy organization.",
      "When arranging furniture, ensure all heavy items are anchored to the wall and there are no dangling cords from window treatments near the crib."
    ],
    date: "March 22, 2024",
    readTime: "4 min read",
    author: "Emma Wilson",
    image: "/products/4.webp",
    category: "Baby Furniture"
  }
];

export default function BlogPost({ params }) {
  const blog = blogs.find(blog => blog.id.toString() === params.id);
  
  if (!blog) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/blogs" className="flex items-center text-pink-600 hover:text-pink-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to all blogs
        </Link>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden border border-pink-100">
          <div className="relative h-64 w-full">
            <Image 
              src={blog.image} 
              alt={blog.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          
          <div className="p-6 md:p-8">
            <span className="inline-block bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full mb-4">
              {blog.category}
            </span>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-pink-800">{blog.title}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <FaCalendarAlt className="mr-1 text-pink-500" />
              <span className="mr-4">{blog.date}</span>
              <FaUser className="mr-1 text-pink-500" />
              <span className="mr-4">{blog.author}</span>
              <span className="ml-2">{blog.readTime}</span>
            </div>
            
            <div className="prose max-w-none">
              {blog.content.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
        
        <div className="mt-12 bg-pink-50 p-6 rounded-lg border border-pink-100">
          <h2 className="text-xl font-bold mb-4 text-pink-800">About the Author</h2>
          <p className="text-gray-700">
            {blog.author} is an expert in {blog.category.toLowerCase()} with years of experience helping parents make the best choices for their babies. 
            {blog.author.includes('Dr.') ? ' As a pediatric specialist, they combine medical knowledge with practical parenting advice.' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}