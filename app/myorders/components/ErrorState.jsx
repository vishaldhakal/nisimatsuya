import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="p-8 text-center border border-red-200 rounded-xl bg-red-50">
      <div className="mb-4 text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-900">Something went wrong</h3>
      <p className="mb-6 text-red-700">{error}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;