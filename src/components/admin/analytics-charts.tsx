'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsChartsProps {
  data: { labels: string[]; values: number[] };
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Sales',
        data: data.values,
        backgroundColor: '#1A1A2E',
      },
    ],
  };

  return <Bar data={chartData} />;
}