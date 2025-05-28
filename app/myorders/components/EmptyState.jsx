import { ShoppingBag } from 'lucide-react';

const EmptyState = ({ filters }) => {
  return (
    <div className="p-12 text-center bg-white border shadow-sm rounded-xl">
      <div className="mb-6 text-gray-300">
        <ShoppingBag className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900">No orders found</h3>
      <p className="max-w-md mx-auto text-gray-500">
        {filters.search 
          ? `No orders found matching "${filters.search}". Try adjusting your search terms.`
          : filters.status === 'all' 
            ? "You haven't placed any orders yet. Start shopping to see your orders here!" 
            : `No ${filters.status} orders found. Try selecting a different status filter.`
        }
      </p>
      {(filters.search || filters.status !== 'all') && (
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-sm text-blue-600 underline hover:text-blue-700"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;