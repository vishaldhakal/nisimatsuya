import { PackageOpen, Calendar, CheckCheck } from "lucide-react";

export default function OrderTracking() {
  const trackingSteps = [
    { label: "Order Placed", completed: true },
    { label: "Processing", completed: false },
    { label: "Shipped", completed: false },
    { label: "Out for Delivery", completed: false },
    { label: "Delivered", completed: false },
  ];

  const getStepDescription = (idx) => {
    const descriptions = [
      "Just now",
      "Processing soon",
      "Will be shipped",
      "Out for delivery",
      "Expected in 3-5 days"
    ];
    return descriptions[idx];
  };

  return (
    <div className="bg-white border border-pink-200 rounded-xl p-6 mt-2 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4 text-pink-600 flex items-center">
        <PackageOpen className="w-5 h-5 mr-2" /> Order Tracking
      </h3>
      <ol className="relative border-l border-pink-200">
        {trackingSteps.map((step, idx) => (
          <li key={idx} className="mb-6 ml-6">
            <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${
              step.completed ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              {step.completed ? <CheckCheck className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            </span>
            <h4 className={`font-medium ${step.completed ? 'text-pink-700' : 'text-gray-700'}`}>
              {step.label}
            </h4>
            <p className="text-xs text-gray-500">{getStepDescription(idx)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}