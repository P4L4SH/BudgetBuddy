export default function SummaryCards({ balance, income, expense }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-theme-card rounded-xl p-5 border border-theme-border hover:border-theme-border2 transition-all duration-300">
        <p className="text-xs txt-mute uppercase tracking-wider mb-1 font-secondary">Balance</p>
        <p className={`text-2xl font-bold tracking-tight ${balance >= 0 ? 'txt-main' : 'text-red-400'}`}>
          ${balance.toFixed(2)}
        </p>
      </div>

      <div className="bg-theme-card rounded-xl p-5 border border-theme-border hover:border-emerald-500/30 transition-all duration-300">
        <p className="text-xs txt-mute uppercase tracking-wider mb-1 font-secondary">Income</p>
        <p className="text-2xl font-bold tracking-tight text-emerald-400">
          +${income.toFixed(2)}
        </p>
      </div>

      <div className="bg-theme-card rounded-xl p-5 border border-theme-border hover:border-red-500/30 transition-all duration-300">
        <p className="text-xs txt-mute uppercase tracking-wider mb-1 font-secondary">Expense</p>
        <p className="text-2xl font-bold tracking-tight text-red-400">
          -${expense.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
