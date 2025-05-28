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
    <div className="p-6 border-b border-gray-100 bg-gray-50 rounded-t-xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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
  );
};

export default OrderHeader;