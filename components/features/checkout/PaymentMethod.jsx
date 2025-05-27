import { CreditCard } from "lucide-react";
import Image from "next/image";

export default function PaymentMethod({ formData, formErrors, onInputChange }) {
  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "/payment-icons/visa.webp" },
    { id: "mastercard", name: "Mastercard", icon: "/payment-icons/mastercard.png" },
    { id: "apple", name: "Apple Pay", icon: "/payment-icons/apple.webp" },
    { id: "google", name: "Google Pay", icon: "/payment-icons/google.webp" },
    { id: "paypal", name: "PayPal", icon: "/payment-icons/paypal.png" },
    { id: "cod", name: "Cash on Delivery", icon: "/payment-icons/cod.png" },
  ];

  const handlePaymentMethodChange = (methodId) => {
    onInputChange({
      target: {
        name: 'paymentMethod',
        value: methodId,
        type: 'radio'
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex items-center mb-4">
        <CreditCard className="h-5 w-5 text-pink-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formData.paymentMethod === method.id 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/30'
              }`}
              onClick={() => handlePaymentMethodChange(method.id)}
            >
              <div className="flex flex-col items-center h-12 mb-2">
                <div className="h-6 mb-2 flex items-center justify-center">
                  <Image 
                    src={method.icon} 
                    alt={method.name} 
                    width={24} 
                    height={24} 
                    className="object-contain" 
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{method.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <input 
                  type="radio" 
                  id={method.id} 
                  name="paymentMethod" 
                  value={method.id}
                  checked={formData.paymentMethod === method.id} 
                  onChange={onInputChange}
                  className="w-4 h-4 text-pink-600 focus:ring-pink-500" 
                />
                <label htmlFor={method.id} className="ml-2 text-xs text-gray-500">Select</label>
              </div>
            </div>
          ))}
        </div>

        {/* Card Details for Visa/Mastercard */}
        {["visa", "mastercard"].includes(formData.paymentMethod) && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4 mt-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber" 
                  value={formData.cardNumber} 
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10`}
                  placeholder="1234 5678 9012 3456" 
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Image 
                    src={formData.paymentMethod === "visa" ? "/payment-icons/visa.webp" : "/payment-icons/mastercard.png"}
                    width={20} 
                    height={20} 
                    alt="Card" 
                  />
                </div>
              </div>
              {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card *
              </label>
              <input 
                type="text" 
                id="cardName" 
                name="cardName" 
                value={formData.cardName} 
                onChange={onInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  formErrors.cardName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                placeholder="Enter name as on card" 
              />
              {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input 
                  type="text" 
                  id="expiryDate" 
                  name="expiryDate" 
                  value={formData.expiryDate} 
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  placeholder="MM/YY" 
                />
                {formErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>}
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input 
                  type="password" 
                  id="cvv" 
                  name="cvv" 
                  value={formData.cvv} 
                  onChange={onInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  placeholder="123" 
                  maxLength="4" 
                />
                {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
              </div>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="savePaymentInfo" 
                name="savePaymentInfo" 
                checked={formData.savePaymentInfo} 
                onChange={onInputChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" 
              />
              <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">
                Save this card for future payments
              </label>
            </div>
          </div>
        )}

        {/* Apple Pay */}
        {formData.paymentMethod === "apple" && (
          <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
            <div className="mb-4">
              <Image src="/payment-icons/apple.webp" width={60} height={30} alt="Apple Pay" className="mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Click the button below to pay with Apple Pay</p>
            <button type="button" className="bg-black text-white py-3 px-6 rounded-lg font-medium w-full sm:w-64">
              Pay with Apple Pay
            </button>
          </div>
        )}

        {/* Google Pay */}
        {formData.paymentMethod === "google" && (
          <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
            <div className="mb-4">
              <Image src="/payment-icons/google.webp" width={60} height={30} alt="Google Pay" className="mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Click the button below to pay with Google Pay</p>
            <button type="button" className="bg-white border border-gray-300 py-3 px-6 rounded-lg font-medium shadow-sm w-full sm:w-64">
              <div className="flex items-center justify-center">
                <Image src="/payment-icons/google.webp" width={80} height={20} alt="Google Pay" />
              </div>
            </button>
          </div>
        )}

        {/* PayPal */}
        {formData.paymentMethod === "paypal" && (
          <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
            <div className="mb-4">
              <Image src="/payment-icons/paypal.png" width={60} height={30} alt="PayPal" className="mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Click the button below to pay with PayPal</p>
            <button type="button" className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium w-full sm:w-64">
              Pay with PayPal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}