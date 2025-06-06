
import { useEffect } from 'react';
import TestimonialForm from './TestimonialForm';

const TestimonialModal = ({ isOpen, onClose, testimonial, onSubmit, isLoading }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="relative w-full max-w-2xl p-3 mx-auto bg-white border rounded-md shadow-lg sm:p-5 top-4 sm:top-20">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base font-medium text-gray-900 sm:text-lg">
            {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <TestimonialForm
          testimonial={testimonial}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TestimonialModal;