import React from "react";
const ContactSection = () => {
  return (
    <section className="py-16 bg-stone-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Japanese-inspired design */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            
          </div>
          <h2 className="text-3xl font-light text-stone-800 mb-2 tracking-wide">お問い合わせ</h2>
          <p className="text-lg text-stone-600 font-light tracking-wider">GET IN TOUCH</p>
          <div className="mt-4 border-b border-stone-200 w-24 mx-auto"></div>
        </div>

        <div className="bg-white rounded-none shadow-sm border border-stone-100 p-8 md:p-12">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="block w-full border-0 border-b border-stone-200 bg-transparent py-3 px-0 text-stone-900 focus:border-rose-300 focus:ring-0 transition-colors duration-300"
                  placeholder="First name"
                />
              </div>
              <div className="group">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="block w-full border-0 border-b border-stone-200 bg-transparent py-3 px-0 text-stone-900 focus:border-rose-300 focus:ring-0 transition-colors duration-300"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="group">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full border-0 border-b border-stone-200 bg-transparent py-3 px-0 text-stone-900 focus:border-rose-300 focus:ring-0 transition-colors duration-300"
                placeholder="Email"
              />
            </div>

            <div className="group">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full border-0 border-b border-stone-200 bg-transparent py-3 px-0 text-stone-900 focus:border-rose-300 focus:ring-0 resize-none transition-colors duration-300"
                placeholder="Message"
              />
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                className="inline-flex w-full sm:w-auto justify-center py-3 px-12 text-base font-light rounded-none text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-xs flex justify-between">
            <div className="h-1 w-1 rounded-full bg-rose-300"></div>
            <div className="h-1 w-1 rounded-full bg-rose-300"></div>
            <div className="h-1 w-1 rounded-full bg-rose-300"></div>
            <div className="h-1 w-1 rounded-full bg-rose-300"></div>
            <div className="h-1 w-1 rounded-full bg-rose-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;