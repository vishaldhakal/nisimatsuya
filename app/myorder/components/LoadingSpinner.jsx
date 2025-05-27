const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent rounded-full border-t-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-gray-600">Loading your orders...</p>
    </div>
  );
};

export default LoadingSpinner;