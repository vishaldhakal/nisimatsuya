import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SortIcon = ({ column, sortColumn, sortDirection }) => (
  <span className="inline-flex ml-1">
    {sortColumn === column ? (
      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4 opacity-30" />
    )}
  </span>
);

export default SortIcon;