import { useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OrderTracking from "./OrderTracking";

export default function OrderCompleteScreen({ orderNumber, orderSummary, logoConfig }) {
  const [showTracking, setShowTracking] = useState(false);

  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "/payment-icons/visa.webp" },
    { id: "mastercard", name: "Mastercard", icon: "/payment-icons/mastercard.png" },
    { id: "apple", name: "Apple Pay", icon: "/payment-icons/apple.webp" },
    { id: "google", name: "Google Pay", icon: "/payment-icons/google.webp" },
    { id: "paypal", name: "PayPal", icon: "/payment-icons/paypal.png" },
    { id: "cod", name: "Cash on Delivery", icon: "/payment-icons/cod.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="text-center flex flex-col items-center justify-center py-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="mb-2">
              <Image
                src={logoConfig.src}
                alt={logoConfig.alt}
                width={logoConfig.width}
                height={logoConfig.height}
                className="mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
            
            <div className="bg-gray-50 px-6 py-4 rounded-xl w-full max-w-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Order Number</p>
                  <p className="text-gray-800 font-medium">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Order Date</p>
                  <p className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Payment Method</p>
                  <p className="text-gray-800 font-medium">
                    {paymentMethods.find(method => method.id === orderSummary?.paymentMethod)?.name || "Card"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="text-green-600 font-medium">₹{orderSummary?.total_amount}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3 mb-4 w-full max-w-md">
              <Link href="/" className="flex-1 bg-white border border-pink-500 text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors duration-200 flex items-center justify-center">
                Return to Home
              </Link>
              <button
                className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setShowTracking((prev) => !prev)}
                type="button"
              >
                {showTracking ? "Hide Tracking" : "Track Order"}
              </button>
            </div>
            
            {showTracking && <OrderTracking />}
          </div>
        </div>
      </div>
    </div>
  );
}