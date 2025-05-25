import SectionHeader from "../SectionHeader/SectionHeader";

export default function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <SectionHeader title="Stay Updated with Our Newsletter" />
        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
          <div className="relative w-full sm:w-auto flex-grow">
            <input
              type="email"
              placeholder="✉️  Enter your email address"
              className="w-full px-6 py-4 rounded-full border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-900 bg-white shadow-sm transition-all duration-300 hover:border-pink-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Subscribe Now
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
