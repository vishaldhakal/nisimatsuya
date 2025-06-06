import { useState } from 'react';

const TestimonialsTable = ({ testimonials, onEdit, onDelete, isLoading }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info', action: null });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const showToast = (message, type = 'info', action = null) => {
    setToast({ show: true, message, type, action });
    if (!action) {
      setTimeout(() => setToast({ show: false, message: '', type: 'info', action: null }), 3000);
    }
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'info', action: null });
    setPendingDeleteId(null);
  };

  const handleDeleteClick = (testimonial) => {
    setPendingDeleteId(testimonial.id);
    showToast(
      `Delete "${testimonial.name}"'s testimonial?`,
      'warning',
      {
        confirm: () => {
          onDelete(testimonial.id);
          hideToast();
          showToast('Testimonial deleted successfully', 'success');
        },
        cancel: hideToast
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Toast Component
  const Toast = () => {
    if (!toast.show) return null;

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }[toast.type];

    return (
      <div className="fixed z-50 duration-300 top-4 right-4 animate-in slide-in-from-top-2">
        <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            {!toast.action && (
              <button
                onClick={hideToast}
                className="ml-3 text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
          </div>
          {toast.action && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={toast.action.confirm}
                className="px-3 py-1 text-xs font-medium text-gray-800 bg-white rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Yes, Delete
              </button>
              <button
                onClick={toast.action.cancel}
                className="px-3 py-1 text-xs font-medium text-white bg-transparent border border-white rounded hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full sm:w-8 sm:h-8 animate-spin"></div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-base text-gray-500 sm:text-lg">No testimonials found</div>
        <div className="mt-2 text-sm text-gray-400">Add your first testimonial to get started</div>
      </div>
    );
  }

  return (
    <>
      <Toast />
      
      {/* Mobile Card View - Enhanced for better responsiveness */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-3 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 hover:shadow-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {testimonial.image ? (
                    <img
                      className="object-cover w-10 h-10 rounded-full sm:w-12 sm:h-12"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full sm:w-12 sm:h-12">
                      <span className="text-xs font-medium text-gray-700 sm:text-sm">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate sm:text-base">
                        {testimonial.name}
                      </p>
                      {testimonial.designation && (
                        <p className="text-xs text-gray-500 truncate sm:text-sm">
                          {testimonial.designation}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 ml-2 space-x-1 sm:space-x-2">
                      <button
                        onClick={() => onEdit(testimonial)}
                        className="px-2 py-1 text-xs font-medium text-blue-600 transition-colors rounded hover:text-blue-900 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(testimonial)}
                        className="px-2 py-1 text-xs font-medium text-red-600 transition-colors rounded hover:text-red-900 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-900 sm:text-sm">
                    {truncateText(testimonial.comment, window.innerWidth < 640 ? 60 : 100)}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(testimonial.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View - Enhanced for larger screens */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:px-6">
                  Profile
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:px-6">
                  Name & Designation
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:px-6">
                  Comment
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:px-6">
                  Date Added
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase xl:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-4 xl:px-6 whitespace-nowrap">
                    <div className="flex-shrink-0 w-10 h-10 xl:w-12 xl:h-12">
                      {testimonial.image ? (
                        <img
                          className="object-cover w-10 h-10 rounded-full xl:w-12 xl:h-12"
                          src={testimonial.image}
                          alt={testimonial.name}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full xl:w-12 xl:h-12">
                          <span className="text-sm font-medium text-gray-700">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 xl:px-6 whitespace-nowrap">
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
                  <td className="px-4 py-4 xl:px-6">
                    <div className="max-w-xs text-sm leading-relaxed text-gray-900 xl:max-w-md">
                      {truncateText(testimonial.comment, 80)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 xl:px-6 whitespace-nowrap">
                    {formatDate(testimonial.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-right xl:px-6 whitespace-nowrap">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(testimonial)}
                        className="px-3 py-1 font-medium text-blue-600 transition-colors rounded hover:text-blue-900 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(testimonial)}
                        className="px-3 py-1 font-medium text-red-600 transition-colors rounded hover:text-red-900 hover:bg-red-50"
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
      </div>
    </>
  );
};


export default TestimonialsTable;