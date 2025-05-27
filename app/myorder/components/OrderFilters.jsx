import { SearchIcon } from 'lucide-react';

const OrderFilters = ({ filters, statusCounts, onStatusFilter, onSearchChange }) => {
  const statusOptions = [
    { key: 'all', label: 'All Orders', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { key: 'processing', label: 'Processing', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { key: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700 border-green-200' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

  return (
    <div className="p-6 mb-8 bg-white border shadow-sm rounded-xl">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by order number, product name..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">Filter by Status</h3>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map((status) => (
            <button
              key={status.key}
              onClick={() => onStatusFilter(status.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                filters.status === status.key
                  ? status.color + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              {status.label}
              {statusCounts[status.key] !== undefined && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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