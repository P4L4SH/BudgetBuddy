import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeExpenseChart({ income, expense }) {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  if (income === 0 && expense === 0) {
    return (
      <div className="bg-theme-card rounded-xl p-4 border border-theme-border h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-1">📊</p>
          <p className="txt-sec text-xs font-secondary">Add transactions to see chart</p>
        </div>
      </div>
    );
  }

  const data = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [income, expense],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderColor: ['#16a34a', '#dc2626'],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#a1a1aa' : '#71717a',
          font: { family: 'Montserrat', size: 9 },
          padding: 10,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
        titleFont: { family: 'Montserrat', size: 10 },
        bodyFont: { family: 'Montserrat', size: 10 },
        titleColor: isDark ? '#ffffff' : '#18181b',
        bodyColor: isDark ? '#a1a1aa' : '#52525b',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e4e4e7',
        borderWidth: 1,
        padding: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: $${ctx.parsed.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="bg-theme-card rounded-xl p-3 border border-theme-border h-full flex flex-col items-center justify-center">
      <h3 className="text-[10px] txt-mute uppercase tracking-wider font-medium mb-2 font-secondary">Income vs Expense</h3>
      <div className="w-full max-w-[130px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
