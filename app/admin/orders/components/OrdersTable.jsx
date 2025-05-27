import React from 'react';
import { RefreshCw } from 'lucide-react';
import SortIcon from './SortIcon';
import OrderDetails from './OrderDetails';
import { formatCurrency, formatDate, getStatusIcon, getStatusColor } from './utils';

const OrdersTable = ({ 
  orders, 
  sortColumn, 
  sortDirection, 
  onSort, 
  expandedOrder, 
  onToggleExpand, 
  onUpdateStatus, 
  isUpdating 
}) => (
  <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
    {/* Mobile view - card layout */}
    <div className="p-2 space-y-3 sm:hidden">
      {orders.map((order) => (
        <div 
          key={order.order_number}
          className={`p-3 border rounded-lg ${expandedOrder === order.order_number ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}
          onClick={() => onToggleExpand(order.order_number)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
              <p className="text-sm font-medium text-gray-900">{order.full_name || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total_amount || order.totalAmount)}
              </p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status || 'pending'}</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              {formatDate(order.created_at || order.date)}
            </p>
            <select
              value={order.status || 'pending'}
              onChange={(e) => onUpdateStatus(order.order_number, e.target.value)}
              disabled={isUpdating === order.order_number}
              className="block px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={e => e.stopPropagation()}
            >
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
          
          {isUpdating === order.order_number && (
            <div className="flex justify-center mt-1">
              <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
            </div>
          )}
          
          {expandedOrder === order.order_number && (
            <div className="mt-3">
              <OrderDetails order={order} />
            </div>
          )}
        </div>
      ))}
    </div>
    
    {/* Desktop view - table layout */}
    <div className="hidden overflow-x-auto sm:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['id', 'customer_name', 'date', 'amount'].map((column) => (
              <th 
                key={column}
                scope="col" 
                className={`px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer ${column === 'date' ? 'hidden sm:table-cell' : ''}`}
                onClick={() => onSort(column)}
              >
                <div className="flex items-center">
                  {column === 'id' ? 'Order ID' : 
                   column === 'customer_name' ? 'Customer' : 
                   column === 'date' ? 'Date' : 'Amount'}
                  <SortIcon column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <React.Fragment key={order.order_number}>
              <tr 
                className={`hover:bg-gray-50 cursor-pointer ${expandedOrder === order.order_number ? 'bg-blue-50' : ''}`}
                onClick={() => onToggleExpand(order.order_number)}
              >
                <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {order.order_number}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.full_name || 'N/A'}</div>
                </td>
                <td className="hidden px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell">
                  {formatDate(order.created_at || order.date)}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {formatCurrency(order.total_amount || order.totalAmount)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status || 'pending'}</span>
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => onUpdateStatus(order.order_number, e.target.value)}
                    disabled={isUpdating === order.order_number}
                    className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={e => e.stopPropagation()}
                  >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                  {isUpdating === order.order_number && (
                    <div className="flex justify-center mt-1">
                      <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                    </div>
                  )}
                </td>
              </tr>
              {expandedOrder === order.order_number && (
                <tr><OrderDetails order={order} /></tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersTable;