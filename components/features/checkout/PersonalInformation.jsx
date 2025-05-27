export default function PersonalInformation({ formData, formErrors, onInputChange }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            value={formData.fullName} 
            onChange={onInputChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            placeholder="Enter your full name" 
          />
          {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="Enter your email" 
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={onInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
              placeholder="10-digit mobile number" 
            />
            {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}