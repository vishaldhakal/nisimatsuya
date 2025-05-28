import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const OrderFilters = ({ filters, statusCounts, onStatusFilter, onSearchChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusOptions = [
    { key: 'all', label: 'All Orders', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { key: 'processing', label: 'Processing', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { key: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-200' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

  const currentStatus = statusOptions.find(status => status.key === filters.status);

  const handleStatusSelect = (statusKey) => {
    onStatusFilter(statusKey);
    setIsDropdownOpen(false);
  };

  return (
    <div className="p-3 mx-2 mb-4 bg-white border shadow-sm sm:p-6 sm:mb-8 rounded-xl sm:mx-0">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none sm:pl-4">
            <Search className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700 sm:mb-3">Filter by Status</h3>
        
        {/* Mobile Dropdown (screens < 640px) */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
              currentStatus ? currentStatus.color + ' shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <span>{currentStatus?.label || 'All Orders'}</span>
              {statusCounts[filters.status] !== undefined && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  currentStatus ? 'bg-white bg-opacity-70' : 'bg-gray-200'
                }`}>
                  {statusCounts[filters.status]}
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {statusOptions.map((status) => (
                <button
                  key={status.key}
                  onClick={() => handleStatusSelect(status.key)}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                    filters.status === status.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{status.label}</span>
                    {statusCounts[status.key] !== undefined && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        filters.status === status.key ? 'bg-blue-100' : 'bg-gray-200'
                      }`}>
                        {statusCounts[status.key]}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Button Layout (screens >= 640px) */}
        <div className="flex-wrap hidden gap-2 sm:flex md:gap-3">
          {statusOptions.map((status) => (
            <button
              key={status.key}
              onClick={() => onStatusFilter(status.key)}
              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
                filters.status === status.key
                  ? status.color + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              {status.label}
              {statusCounts[status.key] !== undefined && (
                <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 text-xs rounded-full ${
                  filters.status === status.key 
                    ? 'bg-white bg-opacity-70' 
                    : 'bg-gray-200'
                }`}>
                  {statusCounts[status.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;