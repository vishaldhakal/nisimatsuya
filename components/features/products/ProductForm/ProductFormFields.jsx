"use client";

export default function ProductFormFields({ formData, handleChange, categories }) {
  return (
    <>
      {/* Product Name */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2 font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 mb-4 bg-white border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}