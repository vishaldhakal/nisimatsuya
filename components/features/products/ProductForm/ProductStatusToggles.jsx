"use client";

export default function ProductStatusToggles({ formData, handleToggle }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Product Status</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {['is_popular', 'is_featured', 'is_active'].map((field) => (
          <div key={field} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <span className="text-gray-700 font-medium capitalize">
              {field.replace('is_', '').replace('_', ' ')}
            </span>
            <button
              type="button"
              onClick={() => handleToggle(field)}
              className={`relative h-7 w-14 flex items-center rounded-full px-1 transition-colors duration-300 focus:outline-none ${
                formData[field] ? "bg-green-500" : "bg-gray-300"
              }`}
              aria-pressed={formData[field]}
            >
              <span className="sr-only">{formData[field] ? 'Enabled' : 'Disabled'}</span>
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                  formData[field] ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}