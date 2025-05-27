import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ error }) => (
  <div className="p-4 mb-4 border border-red-200 rounded-md bg-red-50">
    <div className="flex">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <div className="ml-3">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  </div>
);

export default ErrorAlert;