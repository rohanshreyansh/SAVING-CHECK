
import React from 'react';
import type { Transaction } from '../types';

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ title, transactions }) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      {transactions.length > 0 ? (
        <ul className="divide-y divide-gray-700">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{transaction.description}</p>
                <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No transactions yet.</p>
      )}
    </div>
  );
};
