import React from "react";
import Image from "next/image";

const ContactSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Image */}
        <div className="relative w-full">
          <Image
            src="/hero.png"
            alt="Contact Us"
            width={500}
            height={500}
            priority
          />
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900">Get in Touch</h2>
        </div>

        <div className="bg-white rounded-lg p-8">
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="relative">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="peer h-14 w-full rounded-md border border-gray-200 bg-[#f8f9fa] px-4 pt-4 text-gray-900 "
                  placeholder=" "
                />
                <label
                  htmlFor="first-name"
                  className="pointer-events-none absolute left-4 top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:text-sm "
                >
                  First name
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="peer h-14 w-full rounded-md border border-gray-200 bg-[#f8f9fa] px-4 pt-4 text-gray-900 "
                  placeholder=" "
                />
                <label
                  htmlFor="last-name"
                  className="pointer-events-none absolute left-4 top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:text-sm "
                >
                  Last name
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                className="peer h-14 w-full rounded-md border border-gray-200 bg-[#f8f9fa] px-4 pt-4 text-gray-900 "
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="pointer-events-none absolute left-4 top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:text-sm "
              >
                Email
              </label>
            </div>

            <div className="relative">
              <textarea
                id="message"
                name="message"
                rows={6}
                className="peer w-full rounded-md border border-gray-200 bg-[#f8f9fa] px-4 pt-6 pb-2 text-gray-900 "
                placeholder=" "
              />
              <label
                htmlFor="message"
                className="pointer-events-none absolute left-4 top-4 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:text-sm peer-focus:text-pink-500"
              >
                Message
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex w-full justify-center py-4 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-600 to-pink-500 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
