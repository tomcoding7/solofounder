import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CompletedAction } from '@/types/game';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartProps {
  actions: CompletedAction[];
}

export default function ProgressChart({ actions }: ProgressChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'MMM dd');
  });

  const dailyXP = last7Days.map(day => {
    return actions
      .filter(action => format(new Date(action.timestamp), 'MMM dd') === day)
      .reduce((sum, action) => sum + action.xp, 0);
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: 'Daily XP',
        data: dailyXP,
        fill: false,
        borderColor: 'rgb(124, 58, 237)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(124, 58, 237)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} XP`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'XP Gained',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">XP Progress</h2>
      <Line data={data} options={options} />
    </div>
  );
} 