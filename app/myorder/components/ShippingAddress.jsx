import { MapPin, User, Phone } from 'lucide-react';

const ShippingAddress = ({ order }) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h4 className="mb-4 text-lg font-semibold text-gray-900">Shipping Information</h4>
      
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <div className="space-y-3">
          {/* Customer Name */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Recipient</p>
              <p className="text-base font-semibold text-gray-900">{order.full_name}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone</p>
              <p className="text-base text-gray-900">{order.phone_number}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Delivery Address</p>
              <div className="mt-1 space-y-1 text-base text-gray-900">
                <p className="font-medium">{order.shipping_address}</p>
                <p>
                  {order.city}, 
                  Zip Code : {order.zip_code}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;