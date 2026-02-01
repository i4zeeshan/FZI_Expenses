
import React, { useState, useMemo } from 'react';
import { Expense, Category } from '../types';
import { CATEGORY_ICONS, PAYMENT_ICONS, CATEGORIES } from '../constants';
import { Trash2, Search, ArrowUpDown, Filter } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'asc' | 'desc' } | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (exp.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (!sortConfig) return b.createdAt - a.createdAt; // Default to newest first
        const { key, direction } = sortConfig;
        if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
        if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [expenses, searchTerm, categoryFilter, sortConfig]);

  const toggleSort = (key: keyof Expense) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            className="flex-1 md:w-48 bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-2">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('description')}>
                <div className="flex items-center gap-2">Description <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => toggleSort('amount')}>
                <div className="flex items-center justify-end gap-2">Amount <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No expenses found matching your filters.
                </td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{expense.description}</span>
                      {expense.notes && <span className="text-xs text-slate-400 mt-0.5">{expense.notes}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 rounded-full w-fit text-slate-600 font-medium text-xs">
                      {CATEGORY_ICONS[expense.category]}
                      {expense.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                      {PAYMENT_ICONS[expense.paymentMode]}
                      {expense.paymentMode}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
