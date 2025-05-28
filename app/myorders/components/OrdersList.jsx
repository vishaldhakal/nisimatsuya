import OrderCard from './OrderCard';

const OrdersList = ({ orders }) => {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;