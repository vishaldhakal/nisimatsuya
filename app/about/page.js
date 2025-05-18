"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Heart,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Love & Care",
      description:
        "Every product is created with the same love and care we'd want for our own children.",
    },
    {
      icon: <Shield className="w-8 h-8 text-pink-500" />,
      title: "Safety First",
      description:
        "We ensure all our products meet the highest safety standards for your little ones.",
    },
    {
      icon: <Truck className="w-8 h-8 text-pink-500" />,
      title: "Reliable Service",
      description:
        "Fast and reliable delivery to your doorstep, because we know time matters.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-pink-500" />,
      title: "Quality Promise",
      description:
        "We stand behind every product with our 100% satisfaction guarantee.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/team/1.jpg",
      bio: "Mother of two, passionate about providing the best for babies.",
    },
    {
      name: "Michael Chen",
      role: "Product Director",
      image: "/team/2.jpg",
      bio: "15+ years of experience in baby product development.",
    },
    {
      name: "Emma Davis",
      role: "Customer Care",
      image: "/team/3.jpg",
      bio: "Dedicated to ensuring every parent has a great shopping experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="text-gray-900 font-medium">About Us</li>
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">
                Caring for Your Little Ones Since 2010
              </h1>
              <p className="text-lg text-gray-600">
                We're more than just a baby shop. We're a community of parents,
                caregivers, and baby product experts dedicated to making your
                parenting journey easier and more enjoyable.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/about/hero.jpg"
                alt="Happy family with baby"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from product selection
              to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/about/story.jpg"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600">
                It all began in 2010 when our founder, Sarah, struggled to find
                high-quality, safe baby products for her first child. Frustrated
                by the lack of options, she decided to create a one-stop shop
                for parents who care about quality and safety.
              </p>
              <p className="text-gray-600">
                Today, we're proud to serve thousands of families across the
                country, offering carefully curated products that meet our
                strict standards for quality, safety, and value.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">10+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">50k+</div>
                  <div className="text-gray-600">Happy Families</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind our success, dedicated to serving you
              better every day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-pink-500 mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Growing Family
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the difference of shopping with a company that truly
            cares about your baby's well-being.
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
