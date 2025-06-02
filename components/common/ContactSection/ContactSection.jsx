import React from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
const ContactSection = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-pink-500" />,
      title: "Visit Us",
      details: ["123 Baby Avenue, Suite 101", "New York, NY 10001"]
    },
    {
      icon: <Phone className="w-6 h-6 text-pink-500" />,
      title: "Call Us",
      details: ["Customer Support", "(800) 123-4567"]
    },
    {
      icon: <Mail className="w-6 h-6 text-pink-500" />,
      title: "Email Us",
      details: ["General Inquiries", "hello@babyshop.com"]
    }
  ];

  return (
    <section className="relative min-h-screen py-10 bg-gradient-to-b from-yellow-50 to-pink-50">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 bg-pink-200 rounded-full w-80 h-80 mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header with Japanese-inspired design */}
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-4xl font-bold tracking-wide text-gray-900">お問い合わせ</h2>
          <p className="text-lg font-light tracking-wider text-gray-600">GET IN TOUCH</p>
          <div className="w-24 mx-auto mt-4 border-b border-pink-300"></div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="p-6 transition-shadow duration-300 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{info.title}</h3>
                    <p className="text-gray-600">
                      {info.details.map((detail, i) => (
                        <span key={i} className="block">
                          {detail}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Social media */}
            <div className="p-6 bg-white shadow-sm rounded-2xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Follow Us</h3>
              <div className="flex gap-4">
                <Link href="#" className="p-3 text-pink-600 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-pink-200">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-3 text-pink-600 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-pink-200">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-3 text-pink-600 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-pink-200">
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="overflow-hidden bg-white border border-pink-100 shadow-lg rounded-2xl">
            <div className="p-8 md:p-10">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="group">
                    <label htmlFor="first-name" className="block mb-1 text-sm font-medium text-gray-700">First name</label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      className="block w-full px-4 py-3 text-gray-900 transition-colors duration-300 bg-transparent border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="last-name" className="block mb-1 text-sm font-medium text-gray-700">Last name</label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      className="block w-full px-4 py-3 text-gray-900 transition-colors duration-300 bg-transparent border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full px-4 py-3 text-gray-900 transition-colors duration-300 bg-transparent border border-gray-300 rounded-lg focus:border-pink-500 focus:ring-pink-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="block w-full px-4 py-3 text-gray-900 transition-colors duration-300 bg-transparent border border-gray-300 rounded-lg resize-none focus:border-pink-500 focus:ring-pink-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full px-8 py-4 text-base font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-16">
          <div className="flex justify-between w-full max-w-xs">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-pink-300 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;