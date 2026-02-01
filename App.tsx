
import React, { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseFormData } from './types';
import { Card } from './components/Card';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseTable } from './components/ExpenseTable';
import { CategoryPieChart, SpendingBarChart, PaymentModeChart, TrendChart } from './components/Charts';
import { 
  TrendingUp, 
  Wallet, 
  PieChart as PieChartIcon, 
  Plus, 
  TrendingDown,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ChevronRight,
  Calendar,
  ArrowLeft,
  CalendarDays,
  History
} from 'lucide-react';

const STORAGE_KEY = 'expense_tracker_data_v1';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'transactions'>('home');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      paymentMode: data.paymentMode,
      date: data.date,
      notes: data.notes,
      createdAt: Date.now()
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowAddForm(false);
  };

  const deleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === null) return expenses;
    return expenses.filter(e => new Date(e.date).getMonth() === selectedMonth);
  }, [expenses, selectedMonth]);

  const stats = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const viewTotal = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Daily Average Logic: From the day data started
    let dailyAvg = 0;
    if (expenses.length > 0) {
      const startDates = expenses.map(e => new Date(e.date).getTime());
      const firstDate = Math.min(...startDates);
      const today = new Date().getTime();
      const diffTime = Math.abs(today - firstDate);
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      dailyAvg = total / diffDays;
    }

    // Find top category in current view
    const catMap: Record<string, number> = {};
    filteredExpenses.forEach(e => catMap[e.category] = (catMap[e.category] || 0) + e.amount);
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { total, viewTotal, dailyAvg, topCategory };
  }, [expenses, filteredExpenses]);

  const handleMonthClick = (index: number) => {
    setSelectedMonth(index);
    setActiveView('dashboard');
  };

  const renderHome = () => (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Financial Overview</h1>
        <p className="text-slate-500 text-lg">Select a month to view detailed insights or browse all your records.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className="group relative overflow-hidden bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all text-center"
          >
            <div className="absolute top-0 right-0 p-3 text-slate-50 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
              <Calendar className="w-16 h-16" />
            </div>
            <span className="block text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{month}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1 block">2025</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button 
          onClick={() => {
            setSelectedMonth(null);
            setActiveView('transactions');
          }}
          className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg"
        >
          <History className="w-6 h-6" />
          View All Transactions
        </button>
        
        <button 
          onClick={() => {
            setSelectedMonth(new Date().getMonth());
            setActiveView('dashboard');
          }}
          className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-emerald-100"
        >
          <LayoutDashboard className="w-6 h-6" />
          Quick Dashboard (Current Month)
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {activeView === 'home' ? (
        renderHome()
      ) : (
        <div className="flex flex-1">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 fixed h-full">
            <button 
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2 mb-10 group"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">ExpenseInsight</h1>
            </button>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveView('home')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <div className="pt-4 pb-2 px-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Views</span>
              </div>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveView('transactions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'transactions' ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
              >
                <ReceiptText className="w-5 h-5" />
                Transactions
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                  {selectedMonth !== null ? `${MONTHS[selectedMonth]} ` : ''}{activeView}
                </h2>
                <p className="text-slate-500 text-sm">
                  {selectedMonth !== null ? `Viewing records for ${MONTHS[selectedMonth]}` : 'Viewing all-time financial activity'}
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveView('home')}
                  className="lg:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  New Expense
                </button>
              </div>
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="!p-0 border-l-4 border-l-emerald-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {selectedMonth !== null ? MONTHS[selectedMonth] : 'All Time'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Spending</p>
                  <h3 className="text-3xl font-bold text-slate-900">₹{stats.viewTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
              </Card>

              <Card className="!p-0 border-l-4 border-l-blue-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <CalendarDays className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Since Start</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Daily Average</p>
                  <h3 className="text-3xl font-bold text-slate-900">₹{stats.dailyAvg.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                </div>
              </Card>

              <Card className="!p-0 border-l-4 border-l-amber-500">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <PieChartIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Top Category</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Biggest Spend</p>
                  <h3 className="text-3xl font-bold text-slate-900 line-clamp-1">{stats.topCategory}</h3>
                </div>
              </Card>
            </div>

            {activeView === 'dashboard' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card title="Expense Trend">
                    <TrendChart expenses={filteredExpenses} />
                  </Card>
                  <Card title="Distribution by Category">
                    <CategoryPieChart expenses={filteredExpenses} />
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card title="Spending Magnitude" className="lg:col-span-2">
                    <SpendingBarChart expenses={filteredExpenses} />
                  </Card>
                  <Card title="Payment Preferences">
                    <PaymentModeChart expenses={filteredExpenses} />
                  </Card>
                </div>

                <Card title="Recent Transactions" headerAction={
                  <button onClick={() => setActiveView('transactions')} className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                }>
                  <div className="overflow-x-auto">
                     <ExpenseTable expenses={filteredExpenses.slice(0, 5)} onDelete={deleteExpense} />
                  </div>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card title="Transaction History">
                  <ExpenseTable expenses={filteredExpenses} onDelete={deleteExpense} />
                </Card>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation (only when not on home) */}
      {activeView !== 'home' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center shadow-2xl z-40">
          <button 
            onClick={() => setActiveView('home')}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-bold">Months</span>
          </button>
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeView === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold">Dashboard</span>
          </button>
          <div className="relative -top-8">
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200 border-4 border-white active:scale-90 transition-transform"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
          <button 
            onClick={() => setActiveView('transactions')}
            className={`flex flex-col items-center gap-1 ${activeView === 'transactions' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <ReceiptText className="w-6 h-6" />
            <span className="text-[10px] font-bold">Activity</span>
          </button>
        </nav>
      )}

      {/* Add Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
          <Card className="relative w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200" title="Log New Expense">
            <ExpenseForm onSubmit={addExpense} onCancel={() => setShowAddForm(false)} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default App;
