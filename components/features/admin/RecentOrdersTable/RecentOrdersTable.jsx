"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function RecentOrdersTable({ orders }) {

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-3 bg-white shadow-sm sm:p-4 md:p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col mb-4 space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">Recent Orders</h3>
        <Link href="/admin/orders">
          <button className="self-start text-xs font-medium text-blue-600 sm:text-sm hover:text-blue-800 sm:self-auto">
            View All Orders
          </button>
        </Link>
      </div>
      
      {orders && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 sm:py-12">
          <ShoppingCart className="w-8 h-8 mb-2 text-gray-400 sm:w-12 sm:h-12 sm:mb-3" />
          <p className="text-sm sm:text-base">No recent orders found</p>
          <p className="mt-1 text-xs sm:text-sm">New orders will appear here</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:px-6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders && orders.map((order, idx) => (
                  <tr key={order.id || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 lg:px-6 whitespace-nowrap">
                      #{order.order_number || `00${idx + 1}`}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 lg:px-6 whitespace-nowrap">
                      {order.full_name || 'Customer ' + (idx + 1)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 lg:px-6 whitespace-nowrap">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 lg:px-6 whitespace-nowrap">
                      {new Date(order.createdAt || new Date()).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 lg:px-6 whitespace-nowrap">
                      <span className={`px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible only on mobile/tablet */}
          <div className="block space-y-3 md:hidden">
            {orders && orders.map((order, idx) => (
              <div key={order.id || idx} className="p-3 border border-gray-200 rounded-lg bg-gray-50 sm:p-4">
                {/* Order ID and Status Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.order_number || `00${idx + 1}`}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                {/* Customer Name */}
                <div className="mb-2">
                  <span className="text-xs tracking-wide text-gray-500 uppercase">Customer</span>
                  <p className="text-sm font-medium text-gray-900">
                    {order.full_name || 'Customer ' + (idx + 1)}
                  </p>
                </div>
                
                {/* Amount and Date Row */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">Amount</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs tracking-wide text-gray-500 uppercase">Date</span>
                    <span className="text-gray-600">
                      {new Date(order.createdAt || new Date()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet Horizontal Scroll Table - Visible only on small tablets */}
          <div className="hidden overflow-x-auto sm:block md:hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders && orders.map((order, idx) => (
                  <tr key={order.id || idx} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      #{order.order_number || `00${idx + 1}`}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {order.full_name || 'Customer ' + (idx + 1)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt || new Date()).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}