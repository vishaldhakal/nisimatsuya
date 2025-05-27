const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'pending': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏳',
        label: 'Pending'
      },
      'processing': {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: '⚙️',
        label: 'Processing'
      },
      'shipped': {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🚚',
        label: 'Shipped'
      },
      'delivered': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
        label: 'Delivered'
      },
      'cancelled': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
        label: 'Cancelled'
      }
    };
    return configs[status?.toLowerCase()] || {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '❓',
      label: status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
    };
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default StatusBadge;