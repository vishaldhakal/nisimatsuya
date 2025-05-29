import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart, ArrowRight } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";

export default function Footer() {
  const { filteredCategories } = useCategories();
  
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      
      

      {/* Main Footer Content */}
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                <Image
                  src="/images/ui/logo.svg"
                  alt="Nishimatsuya Logo"
                  width={40}
                  height={40}
                  className="brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Nishimatsuya</h3>
                <p className="text-sm font-medium text-pink-600">Baby Care Store</p>
              </div>
            </div>
            <p className="mb-8 leading-relaxed text-gray-600">
              Your trusted partner for all baby needs. We provide quality products with love and care for your little ones.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="p-3 transition-all duration-300 transform group bg-gray-50 rounded-xl hover:bg-pink-500 hover:scale-105">
                <Facebook className="w-5 h-5 text-gray-600 transition-colors group-hover:text-white" />
              </a>
              <a href="#" className="p-3 transition-all duration-300 transform group bg-gray-50 rounded-xl hover:bg-pink-500 hover:scale-105">
                <Instagram className="w-5 h-5 text-gray-600 transition-colors group-hover:text-white" />
              </a>
              <a href="#" className="p-3 transition-all duration-300 transform group bg-gray-50 rounded-xl hover:bg-pink-500 hover:scale-105">
                <Twitter className="w-5 h-5 text-gray-600 transition-colors group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-bold text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-pink-600 group"
                  >
                    <ArrowRight className="w-4 h-4 -ml-6 transition-opacity opacity-0 group-hover:opacity-100 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-6 text-lg font-bold text-gray-900">
              Categories
            </h4>
            <ul className="space-y-4">
              {filteredCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products/category/${category.slug}`}
                    className="flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-pink-600 group"
                  >
                    <ArrowRight className="w-4 h-4 -ml-6 transition-opacity opacity-0 group-hover:opacity-100 group-hover:ml-0" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-lg font-bold text-gray-900">
              Get In Touch
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 mt-1 rounded-lg bg-pink-50">
                  <Mail className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-900">Email</p>
                  <a href="mailto:info@nishimatsuya.com" className="text-gray-600 transition-colors hover:text-pink-600">
                    info@nishimatsuya.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 mt-1 rounded-lg bg-pink-50">
                  <Phone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-900">Phone</p>
                  <a href="tel:+1234567890" className="text-gray-600 transition-colors hover:text-pink-600">
                    +1 234 567 890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 mt-1 rounded-lg bg-pink-50">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-900">Address</p>
                  <p className="text-gray-600">
                    123 Baby Lane<br />
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-sm">© 2024 Nishimatsuya. Made with love for families.</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 transition-colors hover:text-pink-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 transition-colors hover:text-pink-600">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 transition-colors hover:text-pink-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}