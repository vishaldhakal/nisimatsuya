const SkeletonCard = () => {
  return (
    <div className="relative overflow-hidden shadow-md rounded-3xl animate-pulse">
      <div className="absolute inset-0 border-2 border-gray-100 rounded-3xl"></div>
      
      {/* Badge skeleton */}
      <div className="absolute z-10 w-12 h-5 bg-gray-200 rounded-full top-3 left-3"></div>

      {/* Heart icon skeleton */}
      <div className="absolute z-10 w-8 h-8 bg-gray-200 rounded-full top-3 right-3"></div>

      <div className="relative flex flex-col h-full p-4 bg-white">
        {/* Image skeleton */}
        <div className="relative flex items-center justify-center flex-1 p-2 mb-3">
          <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="px-2">
          {/* Product name skeleton */}
          <div className="space-y-2">
            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          </div>
          
          {/* Price skeleton */}
          <div className="flex flex-col mt-2 space-y-1">
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
            <div className="w-20 h-5 bg-gray-200 rounded"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Mobile add to cart button skeleton */}
        <div className="w-full h-10 mt-3 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;