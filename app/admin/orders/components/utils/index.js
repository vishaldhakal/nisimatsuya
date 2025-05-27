export const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericAmount);
};

export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (includeTime) {
      return date.toLocaleString('en-US', {
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

export const getStatusIcon = (status) => {
  const { CheckCircle, Clock, RefreshCw, Truck, XCircle, Package } = require('lucide-react');
  const icons = {
    delivered: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    processing: <RefreshCw className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />
  };
  return icons[status?.toLowerCase()] || <Package className="w-4 h-4" />;
};

export const getStatusColor = (status) => {
  const colors = {
    delivered: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};