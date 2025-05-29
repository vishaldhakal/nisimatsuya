import React from 'react';
import { RefreshCw, Search } from 'lucide-react';

 const SearchFilters = ({ searchQuery, filterStatus, onSearch, onFilterChange, onRefresh, isLoading }) => (
  <div className="mb-6 sm:flex sm:items-center sm:justify-between">
    <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
    <div className="flex flex-col gap-3 mt-3 sm:mt-0 sm:flex-row">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by customer name or order ID..."
          value={searchQuery}
          onChange={onSearch}
          className="block w-full py-2 pl-10 pr-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="relative">
        <select
          className="block w-full py-2 pl-3 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
     
        </div>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  </div>
);

export default SearchFilters;