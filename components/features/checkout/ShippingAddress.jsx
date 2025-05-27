import { Truck } from "lucide-react";

export default function ShippingAddress({ formData, formErrors, onInputChange }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <Truck className="h-5 w-5 text-pink-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={onInputChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="Street address, apartment, suite, etc." 
          />
          {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input 
              type="text" 
              id="city" 
              name="city" 
              value={formData.city} 
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="City" 
            />
            {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input 
              type="text" 
              id="state" 
              name="state" 
              value={formData.state} 
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="State" 
            />
            {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
          </div>
          
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input 
              type="text" 
              id="pincode" 
              name="pincode" 
              value={formData.pincode} 
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="6-digit pincode" 
            />
            {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}