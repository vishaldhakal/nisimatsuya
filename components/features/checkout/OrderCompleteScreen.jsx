import { useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import OrderTracking from "./OrderTracking";

export default function OrderCompleteScreen({ orderNumber, orderSummary, logoConfig }) {


  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "images/payment-icons/visa.webp" },
    { id: "mastercard", name: "Mastercard", icon: "images/payment-icons/mastercard.png" },
    { id: "apple", name: "Apple Pay", icon: "images/payment-icons/apple.webp" },
    { id: "google", name: "Google Pay", icon: "images/payment-icons/google.webp" },
    { id: "paypal", name: "PayPal", icon: "images/payment-icons/paypal.png" },
    { id: "cod", name: "Cash on Delivery", icon: "images/payment-icons/cod.png" },
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="p-6 bg-white shadow-sm rounded-2xl lg:p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-6 bg-green-100 rounded-full">
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
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
            <p className="mb-6 text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
            
            <div className="w-full max-w-md px-6 py-4 mb-6 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium text-gray-800">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-800">
                    {paymentMethods.find(method => method.id === orderSummary?.paymentMethod)?.name || "Card"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-green-600">₹{orderSummary?.total_amount}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center w-full max-w-md gap-3 mb-4">
              <Link href="/" className="flex items-center justify-center flex-1 px-6 py-3 font-medium text-pink-600 transition-colors duration-200 bg-white border border-pink-500 rounded-lg hover:bg-pink-50">
                Return to Home
              </Link>
             <Link href="/myorders" >
              <button
                className="flex items-center justify-center flex-1 px-6 py-3 font-medium text-white transition-colors duration-200 bg-pink-600 rounded-lg hover:bg-pink-700"
                
                type="button"
              >
                Track Order
              </button>
             </Link>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}