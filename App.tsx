
import React, { useState, useEffect, useMemo } from 'react';
import type { Transaction } from './types';
import { SummaryCard } from './components/SummaryCard';
import { FinancePieChart } from './components/FinancePieChart';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ArrowUpRightIcon, ArrowDownRightIcon, BanknotesIcon } from './components/icons';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('finance-tracker-transactions');
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('finance-tracker-transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [transactions]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const { totalIncome, totalExpenses, savings } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      savings: income - expenses,
    };
  }, [transactions]);

  const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Monthly Finance Tracker</h1>
          <p className="text-gray-400 mt-1">Your personal dashboard for managing finances.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard title="Total Income" amount={totalIncome} icon={<ArrowUpRightIcon className="w-6 h-6 text-green-900" />} colorClass="bg-green-400" />
          <SummaryCard title="Total Expenses" amount={totalExpenses} icon={<ArrowDownRightIcon className="w-6 h-6 text-red-900" />} colorClass="bg-red-400" />
          <SummaryCard title="Savings" amount={savings} icon={<BanknotesIcon className="w-6 h-6 text-indigo-900" />} colorClass="bg-indigo-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <FinancePieChart income={totalIncome} expenses={totalExpenses} />
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionList title="Income History" transactions={incomeTransactions} />
            <TransactionList title="Expense History" transactions={expenseTransactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
