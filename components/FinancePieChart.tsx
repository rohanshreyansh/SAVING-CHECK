
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancePieChartProps {
  income: number;
  expenses: number;
}

const COLORS = ['#EF4444', '#22C55E']; // Red for expenses, Green for savings

export const FinancePieChart: React.FC<FinancePieChartProps> = ({ income, expenses }) => {
  const savings = Math.max(0, income - expenses);
  
  const data = [
    { name: 'Expenses', value: expenses },
    { name: 'Savings', value: savings },
  ];

  const hasData = income > 0;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-full min-h-[300px] flex flex-col">
       <h2 className="text-xl font-bold text-white mb-4">Financial Distribution</h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                if (percent === 0) return null;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    borderRadius: '0.75rem',
                }}
                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            />
            <Legend iconSize={10} wrapperStyle={{ color: '#9CA3AF' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">Add income to see your financial distribution.</p>
        </div>
      )}
    </div>
  );
};
