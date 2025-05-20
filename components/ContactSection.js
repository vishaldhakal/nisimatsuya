import React from "react";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

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
    <section className="relative py-10 bg-gradient-to-b from-yellow-50 to-pink-50 min-h-screen">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Japanese-inspired design */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">お問い合わせ</h2>
          <p className="text-lg text-gray-600 font-light tracking-wider">GET IN TOUCH</p>
          <div className="mt-4 border-b border-pink-300 w-24 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
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
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-pink-100 p-3 rounded-full text-pink-600 hover:bg-pink-200 transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="group">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      className="block w-full border border-gray-300 rounded-lg bg-transparent py-3 px-4 text-gray-900 focus:border-pink-500 focus:ring-pink-500 transition-colors duration-300"
                      placeholder="Your first name"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      className="block w-full border border-gray-300 rounded-lg bg-transparent py-3 px-4 text-gray-900 focus:border-pink-500 focus:ring-pink-500 transition-colors duration-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full border border-gray-300 rounded-lg bg-transparent py-3 px-4 text-gray-900 focus:border-pink-500 focus:ring-pink-500 transition-colors duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="block w-full border border-gray-300 rounded-lg bg-transparent py-3 px-4 text-gray-900 focus:border-pink-500 focus:ring-pink-500 resize-none transition-colors duration-300"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center py-4 px-8 text-base font-medium rounded-lg text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-xs flex justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-pink-300"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;