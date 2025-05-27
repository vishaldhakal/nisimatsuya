
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Caring for Your Little Ones Since 2010
            </h1>
            <p className="text-lg text-gray-600">
              We're more than just a baby shop. We're a community of parents,
              caregivers, and baby product experts dedicated to making your
              parenting journey easier and more enjoyable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 flex items-center"
              >
                Shop Now <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/banners/happyfamilybabe.webp"
              alt="Happy family with baby"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
