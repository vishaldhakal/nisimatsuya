import StatusBadge from './StatusBadge';

const OrderHeader = ({ order }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-3 mx-2 border-b border-gray-100 sm:p-6 bg-gray-50 rounded-t-xl sm:mx-0">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Mobile: Stack everything vertically */}
        <div className="sm:hidden">
          {/* Order number and status */}
          <div className="flex flex-col gap-2 mb-3">
            <h3 className="text-sm font-bold leading-tight text-gray-900 ">
              Order #{order.order_number}
            </h3>
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <div className="text-right">
                <p className="mb-1 text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold text-gray-900 ">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>
          {/* Date */}
          <p className="text-xs text-gray-600">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Desktop: Original horizontal layout */}
        <div className="flex-row items-center justify-between hidden gap-4 sm:flex">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order.order_number}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.total_amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;