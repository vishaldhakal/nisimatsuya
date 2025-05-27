import Link from "next/link";

export function CTASection() {
  return (
    <div className="bg-gradient-to-r from-pink-600 to-pink-500 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Join Our Growing Family
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Experience the difference of shopping with a company that truly
          cares about your baby's well-being.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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