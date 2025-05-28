import { Package } from 'lucide-react';

const OrderItems = ({ items }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="mb-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-900">Order Items</h4>
      <div className="space-y-4">
        {items?.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
            {/* Product Image */}
            <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-white border border-gray-200 rounded-lg sm:w-20 sm:h-20">
              {item.product_thumbnail_image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.product_thumbnail_image}`}
                  alt={item.product_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h5 className="mb-1 text-base font-semibold text-gray-900 line-clamp-2">
                {item.product_name}
              </h5>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-white border rounded">
                    Qty: {item.quantity}
                  </span>
                  <span>
                    Unit Price: {formatCurrency(item.price / item.quantity)}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;