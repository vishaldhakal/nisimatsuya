import OrderHeader from './OrderHeader';
import OrderItems from './OrderItems';
import ShippingAddress from './ShippingAddress';

const OrderCard = ({ order }) => {
  return (
    <div className="transition-all duration-200 bg-white border shadow-sm rounded-xl hover:shadow-md hover:border-gray-300">
      <OrderHeader order={order} />
      <div className="p-6">
        <OrderItems items={order.items} />
        <ShippingAddress order={order} />
      </div>
    </div>
  );
};

export default OrderCard;