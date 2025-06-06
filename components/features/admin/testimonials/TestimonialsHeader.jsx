
const TestimonialsHeader = ({ onAdd, testimonialsCount }) => {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Testimonials</h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Manage customer testimonials ({testimonialsCount} total)
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center justify-center w-full px-3 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg sm:w-auto sm:px-4 hover:bg-blue-700"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Testimonial</span>
      </button>
    </div>
  );
};

export default TestimonialsHeader;