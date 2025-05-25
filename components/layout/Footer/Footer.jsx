import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-pink-50 border-t border-pink-200 pt-16 pb-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
        {/* Logo Column */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <Image
            src="images/ui/logo.svg"
            alt="Nishimatsuya Logo"
            width={72}
            height={72}
            className="rounded-full mb-4"
          />
          <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
            Your trusted partner for all baby needs. Quality, care, and love in
            every product.
          </p>
        </div>
        {/* Navigation Column */}
        <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-gray-800 hover:text-pink-600 text-base font-medium transition"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/category"
                className="text-gray-800 hover:text-pink-600 text-base font-medium transition"
              >
                Product Category
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-800 hover:text-pink-600 text-base font-medium transition"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-pink-600 text-base font-medium transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* Contact Column */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-base text-gray-700">
            <li>
              Email:{" "}
              <a
                href="mailto:info@nishimatsuya.com"
                className="hover:text-pink-600 transition"
              >
                info@nishimatsuya.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="hover:text-pink-600 transition"
              >
                +1 234 567 890
              </a>
            </li>
            <li>Address: 123 Baby Lane, Kathmandu</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-pink-100 pt-6 text-center text-gray-500 text-base font-medium">
        © 2024 Nishimatsuya. All rights reserved.
      </div>
    </footer>
  );
}
