"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SalesChart({ data }) {
  const formatCurrency = (value) => {
    return Number(value).toLocaleString(undefined, { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'sales') return formatCurrency(value);
            return value;
          }}
        />
        <Area 
          type="monotone" 
          dataKey="sales" 
          stroke="#6366F1" 
          fillOpacity={1} 
          fill="url(#colorSales)" 
          name="Sales" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}