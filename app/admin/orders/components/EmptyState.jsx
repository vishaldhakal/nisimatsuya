import React from 'react';
import { Package } from 'lucide-react';

const EmptyState = ({ searchQuery, filterStatus }) => (
  <div className="p-8 text-center bg-white rounded-lg shadow">
    <Package className="w-12 h-12 mx-auto text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchQuery 
        ? `No orders found matching "${searchQuery}".`
        : filterStatus !== 'all' 
          ? `There are no orders with status "${filterStatus}".`
          : "No orders have been placed yet."
      }
    </p>
  </div>
);

export default EmptyState;