export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-theme-card rounded-xl p-6 border border-theme-border text-center h-full flex flex-col items-center justify-center">
        <div className="text-3xl mb-2">📭</div>
        <p className="txt-sec text-sm font-medium">No transactions yet</p>
        <p className="txt-vmute text-xs mt-1 font-secondary">Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-theme-card rounded-xl border border-theme-border overflow-hidden h-full flex flex-col">
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] txt-mute uppercase tracking-wider bg-theme-header font-secondary">
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Description</th>
              <th className="text-right px-4 py-3 font-medium">Amount</th>
              <th className="text-center px-4 py-3 font-medium">Type</th>
              <th className="text-center px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-theme-border hover:bg-theme-overlay transition-colors duration-150">
                <td className="px-4 py-2.5 txt-sec text-xs whitespace-nowrap font-secondary">{t.created_at}</td>
                <td className="px-4 py-2.5 txt-main font-medium">{t.text}</td>
                <td className={`px-4 py-2.5 text-right text-sm font-semibold whitespace-nowrap ${
                  t.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-secondary ${
                    t.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex gap-1.5 justify-center">
                    <button
                      onClick={() => onEdit(t)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-theme-overlay2 txt-main border border-theme-border2 hover:bg-theme-overlay3 transition-all duration-200 font-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 font-secondary"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
