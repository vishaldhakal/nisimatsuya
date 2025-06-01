
const TestimonialsHeader = ({ onAdd, testimonialsCount }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <p className="mt-1 text-gray-600">
          Manage customer testimonials ({testimonialsCount} total)
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Testimonial</span>
      </button>
    </div>
  );
};

export default TestimonialsHeader;