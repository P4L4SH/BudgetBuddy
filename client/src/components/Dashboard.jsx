import { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCards from './SummaryCards';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import IncomeExpenseChart from './IncomeExpenseChart';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [filter, setFilter] = useState('all');

  // ============================================
  // Theme state — read from localStorage or default to dark
  // ============================================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('budgetbuddy-theme') || 'dark';
  });

  // ============================================
  // Apply theme to <html> when it changes
  // ============================================
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('budgetbuddy-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) { console.error('Failed to fetch:', err); }
  };

  const handleAdd = async (transaction) => {
    try {
      await axios.post('/api/transactions', transaction);
      setEditTransaction(null);
      fetchTransactions();
    } catch (err) { console.error('Failed to add:', err); }
  };

  const handleUpdate = async (id, transaction) => {
    try {
      await axios.put(`/api/transactions/${id}`, transaction);
      setEditTransaction(null);
      fetchTransactions();
    } catch (err) { console.error('Failed to update:', err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (err) { console.error('Failed to delete:', err); }
  };

  const handleEdit = (t) => setEditTransaction(t);
  const handleCancelEdit = () => setEditTransaction(null);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'income') return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true;
  });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filterBtns = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
  ];

  return (
    <div className="h-screen overflow-hidden p-5 sm:p-6 flex flex-col max-w-6xl mx-auto">
      {/* ============================================
          Header with theme toggle
          ============================================ */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold txt-main">BudgetBuddy</h1>
        <div className="flex items-center gap-3">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-theme-card border border-theme-border hover:border-theme-border2 transition-all duration-200"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 txt-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 txt-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] txt-vmute uppercase tracking-wider font-secondary">Live</span>
          </div>
        </div>
      </div>

      <SummaryCards balance={balance} income={totalIncome} expense={totalExpense} />

      <div className="grid grid-cols-5 gap-3 mb-3 flex-shrink-0">
        <div className="col-span-2">
          <IncomeExpenseChart income={totalIncome} expense={totalExpense} />
        </div>
        <div className="col-span-3">
          <TransactionForm
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            editTransaction={editTransaction}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-2 flex-shrink-0">
        {filterBtns.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 font-secondary ${
              filter === btn.id
                ? 'bg-theme-active text-theme-activeText font-semibold'
                : 'bg-theme-overlay txt-sec hover:txt-main hover:bg-theme-overlay2 border border-theme-border'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
