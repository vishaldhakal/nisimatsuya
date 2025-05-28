"use client";

export default function ProductPriceSection({ formData, handleChange }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Market Price</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="market_price"
          value={formData.market_price}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Selling Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Discount (%)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}