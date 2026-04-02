import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Filler, ArcElement
} from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { CAT_COLORS } from '../data/mockData';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement);

export function LineChartComponent({ data }) {
  const { fmt } = useAppContext();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const gridColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const textColor = isDark ? '#888' : '#888';

  const chartData = {
    labels: data.map(m => m.label),
    datasets: [
      { label: 'Income', data: data.map(m => m.income), borderColor: '#639922', backgroundColor: 'rgba(99,153,34,.12)', tension: 0.4, fill: true, pointBackgroundColor: '#639922', pointRadius: 4 },
      { label: 'Expenses', data: data.map(m => m.expense), borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,.10)', tension: 0.4, fill: true, pointBackgroundColor: '#E24B4A', pointRadius: 4 },
      { label: 'Balance', data: data.map(m => m.balance), borderColor: '#378ADD', backgroundColor: 'transparent', tension: 0.4, fill: false, borderDash: [4, 3], pointBackgroundColor: '#378ADD', pointRadius: 3 }
    ]
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#2C2C2A' : '#fff', titleColor: isDark ? '#fff' : '#111', bodyColor: isDark ? '#ccc' : '#555',
        borderColor: isDark ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.1)', borderWidth: 1, padding: 10,
        callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + fmt(ctx.parsed.y) }
      }
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: v => '₹' + Math.abs(v / 1000) + 'k' } }
    }
  };

  return <div style={{ position: 'relative', height: '220px' }}><Line data={chartData} options={options} /></div>;
}

export function PieChartComponent({ data }) {
  const { fmt } = useAppContext();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const topCats = data.slice(0, 6);

  const chartData = {
    labels: topCats.map(c => c[0]),
    datasets: [{
      data: topCats.map(c => c[1]),
      backgroundColor: topCats.map(c => CAT_COLORS[c[0]] || '#888'),
      borderWidth: 2, borderColor: isDark ? '#2C2C2A' : '#fff', hoverOffset: 8
    }]
  };

  const options = {
    responsive: true, maintainAspectRatio: false, cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#2C2C2A' : '#fff', titleColor: isDark ? '#fff' : '#111', bodyColor: isDark ? '#ccc' : '#555',
        borderColor: isDark ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.1)', borderWidth: 1, padding: 10,
        callbacks: { label: ctx => ' ' + ctx.label + ': ' + fmt(ctx.parsed) }
      }
    }
  };

  return <div style={{ position: 'relative', height: '160px' }}><Doughnut data={chartData} options={options} /></div>;
}
