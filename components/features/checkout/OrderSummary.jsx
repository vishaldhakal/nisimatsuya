import Image from "next/image";

const paymentMethods = [
  { id: "visa", name: "Visa", icon: "/images/icons/visa.webp" },
  { id: "mastercard", name: "Mastercard", icon: "/images/icons/mastercard.png" },
  { id: "apple", name: "Apple Pay", icon: "/images/icons/apple.webp" },
  { id: "google", name: "Google Pay", icon: "/images/icons/google.webp" },
  { id: "paypal", name: "PayPal", icon: "/images/icons/paypal.png" },
  { id: "cod", name: "Cash on Delivery", icon: "/images/icons/cod.png" },
];

export default function OrderSummary({ 
  cartItems, 
  totalAmount, 
  calculateShipping, 
  calculateTotal, 
  onSubmit, 
  isSubmitting 
}) {
  return (
    <div className="sticky p-6 bg-white shadow rounded-xl top-6">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="mb-4 overflow-y-auto max-h-64">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
            <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-lg">
              <Image 
                src={item.thumbnail_image ? `${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail_image}` : '/images/ui/placeholder.png'} 
                alt={item.name} 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="flex-1 ml-4">
              <div className="text-sm font-medium text-gray-800">{item.name}</div>
              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Price Breakdown */}
      <div className="pb-4 mb-4 space-y-3 text-sm border-b border-gray-200">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium text-gray-800">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Delivery</p>
          <p className="font-medium text-gray-800">
            {parseFloat(calculateShipping()) === 0 ? 'Free' : `₹${calculateShipping()}`}
          </p>
        </div>
      </div>
      
      {/* Total */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-lg font-bold text-gray-900">Total</p>
        <p className="text-lg font-bold text-pink-600">₹{calculateTotal()}</p>
      </div>
      
      {/* Submit Button */}
      <button 
        type="submit" 
        onClick={onSubmit} 
        disabled={isSubmitting}
        className="w-full py-3 font-semibold text-white transition-colors duration-200 rounded-lg bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 disabled:opacity-70"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg> 
            Processing...
          </span>
        ) : (
          "Confirm & Pay"
        )}
      </button>
      
      {/* Payment Method Icons */}
      <div className="flex items-center justify-center mt-4 space-x-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center">
            <div className="w-10 h-6">
              <Image 
                src={method.icon} 
                width={40} 
                height={24} 
                alt={method.name} 
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Terms and Conditions */}
      <p className="mt-4 text-xs text-center text-gray-500">
        By clicking "Confirm & Pay", you agree to our Terms and Conditions and Privacy Policy.
      </p>
    </div>
  );
}