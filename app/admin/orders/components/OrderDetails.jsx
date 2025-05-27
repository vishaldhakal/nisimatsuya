import React from 'react';
import { formatCurrency, formatDate } from './utils';


const OrderDetails = ({ order }) => (
  <td colSpan={6} className="px-3 py-6 bg-gradient-to-br from-blue-50 to-indigo-50 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Order Information Section */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="p-3 rounded-lg bg-gray-50">
                  <span className="block text-xs font-medium tracking-wide text-gray-500 uppercase">Order Number</span>
                  <span className="text-sm font-semibold text-gray-900">{order.order_number}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <span className="block text-xs font-medium tracking-wide text-gray-500 uppercase">Delivery Fee</span>
                  <span className="text-sm font-semibold text-green-600">{formatCurrency(order.delivery_fee)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{order.full_name}</div>
                    <div className="text-sm text-gray-600">{order.email}</div>
                    <div className="text-sm text-gray-600">{order.phone_number}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">
                      {order.shipping_address}, {order.city}, {order.state} {order.zip_code}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {formatDate(order.created_at, true)}</span>
                <span>Updated: {formatDate(order.updated_at, true)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className={`space-y-3 ${(order.items?.length || 0) > 2 ? 'max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100' : ''}`}>
              {order.items?.map((item, idx) => (
                <div key={item.product_id || idx} className="flex items-start gap-4 p-4 transition-shadow duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md">
                  <div className="flex-shrink-0">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.product_thumbnail_image}`}
                      alt={item.product_name}
                      className="object-cover w-16 h-16 border border-gray-200 rounded-lg sm:w-20 sm:h-20"
                      
                      
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-900 sm:text-base">
                      {item.product_name}
                    </h5>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                         Qty: {item.quantity} 
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.quantity} × {formatCurrency(item.product_price)}

                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <span className="text-xs text-gray-500"> Total Price</span>
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm">No products found</p>
                  </div>
                </div>
              )}
            </div>
            
            {(order.items?.length || 0) > 2 && (
              <div className="mt-3 text-center">
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