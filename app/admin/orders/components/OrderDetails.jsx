import React from 'react';
import { formatCurrency, formatDate } from './utils';
import Image from 'next/image';

const OrderDetails = ({ order }) => (
  <td colSpan={6} className="px-2 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 sm:px-3 sm:py-6 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Order Information Section */}
          <div className="p-3 bg-white border border-gray-200 shadow-sm sm:p-4 lg:p-6 rounded-xl">
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:gap-3">
                <div className="p-2 rounded-lg sm:p-3 bg-gray-50">
                  <span className="block text-xs font-medium tracking-wide text-gray-500 uppercase">Order Number</span>
                  <span className="text-xs font-semibold text-gray-900 break-all sm:text-sm">{order.order_number}</span>
                </div>
                <div className="p-2 rounded-lg sm:p-3 bg-gray-50">
                  <span className="block text-xs font-medium tracking-wide text-gray-500 uppercase">Delivery Fee</span>
                  <span className="text-xs font-semibold text-green-600 sm:text-sm">{formatCurrency(order.delivery_fee)}</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-purple-100 rounded-lg sm:w-8 sm:h-8 mt-0.5">
                    <svg className="w-3 h-3 text-purple-600 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 break-words sm:text-sm">{order.full_name}</div>
                    <div className="text-xs text-gray-600 break-all sm:text-sm">{order.email}</div>
                    <div className="text-xs text-gray-600 sm:text-sm">{order.phone_number}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-green-100 rounded-lg sm:w-8 sm:h-8 mt-0.5">
                    <svg className="w-3 h-3 text-green-600 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 break-words sm:text-sm">
                      {order.shipping_address}, {order.city}, {order.state} {order.zip_code}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 sm:pt-3">
                <div className="flex flex-col gap-1 text-xs text-gray-500 xs:flex-row xs:justify-between xs:gap-0">
                  <span>Created: {formatDate(order.created_at, true)}</span>
                  <span>Updated: {formatDate(order.updated_at, true)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="p-3 bg-white border border-gray-200 shadow-sm sm:p-4 lg:p-6 rounded-xl">
            <div className={`space-y-2 sm:space-y-3 ${(order.items?.length || 0) > 2 ? 'max-h-72 overflow-y-auto pr-1 sm:max-h-80 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : ''}`}>
              {order.items?.map((item, idx) => (
                <div key={item.product_id || idx} className="flex items-start gap-2 p-2 transition-shadow duration-200 border border-gray-200 rounded-lg sm:gap-3 sm:p-3 lg:gap-4 lg:p-4 bg-gray-50 hover:shadow-md">
                  <div className="flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.product_thumbnail_image}`}
                      alt={item.product_name}
                      width={80} 
                      height={80} 
                      className="object-cover w-12 h-12 border border-gray-200 rounded-lg sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                      unoptimized 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-gray-900 break-words sm:text-sm lg:text-base">
                      {item.product_name}
                    </h5>
                    
                    <div className="mt-1 space-y-1 sm:mt-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full sm:px-2 sm:py-1">
                         Qty: {item.quantity} 
                        </span>
                        <span className="text-xs font-medium text-gray-900 sm:text-sm">
                          {item.quantity} × {formatCurrency(item.product_price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <span className="text-xs text-gray-500">Total Price</span>
                        <span className="text-xs font-semibold text-green-600 sm:text-sm">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="flex items-center justify-center py-6 text-gray-500 sm:py-8">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 sm:w-12 sm:h-12 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-xs sm:text-sm">No products found</p>
                  </div>
                </div>
              )}
            </div>
            
            {(order.items?.length || 0) > 2 && (
              <div className="mt-2 text-center sm:mt-3">
                <span className="text-xs text-gray-500">
                  Scroll to view all {order.items.length} products
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </td>
  );

export default OrderDetails;