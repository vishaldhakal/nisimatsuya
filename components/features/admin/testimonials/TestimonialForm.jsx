
import { useState, useEffect } from 'react';

const TestimonialForm = ({ testimonial, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    comment: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        designation: testimonial.designation || '',
        comment: testimonial.comment || '',
        image: null
      });
      if (testimonial.image) {
        setImagePreview(testimonial.image);
      }
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700 sm:mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <label htmlFor="designation" className="block mb-1 text-sm font-medium text-gray-700 sm:mb-2">
          Designation
        </label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter job title or designation"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block mb-1 text-sm font-medium text-gray-700 sm:mb-2">
          Comment *
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none sm:text-base sm:rows-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter testimonial comment"
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700 sm:mb-2">
          Profile Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-16 h-16 border-2 border-gray-200 rounded-full sm:w-20 sm:h-20"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end sm:space-x-3 sm:gap-0">
        <button
          type="button"
          onClick={onCancel}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md sm:w-auto hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md sm:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : testimonial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;