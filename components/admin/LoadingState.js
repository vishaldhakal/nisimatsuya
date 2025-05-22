"use client";

import { RefreshCw } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg">Loading dashboard data...</p>
      </div>
    </div>
  );
}