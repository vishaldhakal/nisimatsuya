import { MapPin, User, Phone } from 'lucide-react';

const ShippingAddress = ({ order }) => {
  return (
    <div className="px-2 pt-4 border-t border-gray-200 sm:pt-6 sm:px-0">
      <h4 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">Shipping Information</h4>
      
      <div className="p-3 border border-blue-200 rounded-lg sm:p-4 bg-blue-50">
        <div className="space-y-3 sm:space-y-3">
          {/* Customer Name */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <User className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">Recipient</p>
              <p className="text-sm font-semibold text-gray-900 break-words sm:text-base">{order.full_name}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Phone className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">Phone</p>
              <p className="text-sm text-gray-900 break-all sm:text-base">{order.phone_number}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-blue-600 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 sm:text-sm">Delivery Address</p>
              <div className="mt-1 space-y-1 text-sm text-gray-900 sm:text-base">
                <p className="font-medium leading-tight break-words">{order.shipping_address}</p>
                <p className="leading-tight break-words">
                  {order.city}, Zip Code: {order.zip_code}
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