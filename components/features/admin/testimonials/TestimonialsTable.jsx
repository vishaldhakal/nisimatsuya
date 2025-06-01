
import { useState } from 'react';

const TestimonialsTable = ({ testimonials, onEdit, onDelete, isLoading }) => {
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      onDelete(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-lg text-gray-500">No testimonials found</div>
        <div className="mt-2 text-sm text-gray-400">Add your first testimonial to get started</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Profile
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Name & Designation
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Comment
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Date Added
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex-shrink-0 w-12 h-12">
                  {testimonial.image ? (
                    <img
                      className="object-cover w-12 h-12 rounded-full"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full">
                      <span className="text-sm font-medium text-gray-700">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.designation && (
                    <div className="text-sm text-gray-500">
                      {testimonial.designation}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs text-sm text-gray-900">
                  {truncateText(testimonial.comment)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {formatDate(testimonial.created_at)}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(testimonial)}
                    className="font-medium text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="font-medium text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestimonialsTable;