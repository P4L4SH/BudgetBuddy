import { useState, useEffect } from 'react';

export default function TransactionForm({ onAdd, onUpdate, editTransaction, onCancelEdit }) {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editTransaction) {
      setText(editTransaction.text);
      setAmount(String(editTransaction.amount));
      setType(editTransaction.type);
      setDate(editTransaction.created_at);
    } else {
      setText('');
      setAmount('');
      setType('income');
      setDate('');
    }
  }, [editTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount || !date) return;
    const data = { text, amount: parseFloat(amount), type, date };
    if (editTransaction) onUpdate(editTransaction.id, data);
    else onAdd(data);
    setText(''); setAmount(''); setType('income'); setDate('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-theme-card rounded-xl p-4 border border-theme-border h-full">
      <h2 className="text-sm font-semibold txt-main mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-theme-dot" />
        {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] txt-mute uppercase tracking-wider mb-1 font-secondary font-medium">Description</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Salary"
              className="w-full bg-theme-input border border-theme-border2 rounded-lg px-3 py-2 text-sm txt-main placeholder-txt-place focus:outline-none focus:border-theme-active/40 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] txt-mute uppercase tracking-wider mb-1 font-secondary font-medium">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-theme-input border border-theme-border2 rounded-lg px-3 py-2 text-sm txt-main placeholder-txt-place focus:outline-none focus:border-theme-active/40 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 items-end">
          <div>
            <label className="block text-[10px] txt-mute uppercase tracking-wider mb-1 font-secondary font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-theme-input border border-theme-border2 rounded-lg px-3 py-2 text-sm txt-main focus:outline-none focus:border-theme-active/40 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] txt-mute uppercase tracking-wider mb-1 font-secondary font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="w-full bg-theme-input border border-theme-border2 rounded-lg px-3 py-2 text-sm txt-main focus:outline-none focus:border-theme-active/40 transition-all duration-200"
              required
            />
          </div>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-theme-active text-theme-activeText hover:opacity-90 font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              {editTransaction ? 'Update' : 'Add'}
            </button>
            {editTransaction && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="bg-theme-overlay2 hover:bg-theme-overlay3 txt-sec font-medium text-sm px-4 py-2 rounded-lg border border-theme-border2 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
