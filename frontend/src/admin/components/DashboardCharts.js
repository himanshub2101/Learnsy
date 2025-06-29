// DashboardCharts.jsx
import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale
} from 'chart.js';

import './DashboardCharts.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const DashboardCharts = ({ enrollments }) => {
  // 🔹 Course-wise Enrollment Count
  const courseCount = enrollments.reduce((acc, curr) => {
    acc[curr.courseName] = (acc[curr.courseName] || 0) + 1;
    return acc;
  }, {});

  const courseLabels = Object.keys(courseCount);
  const courseValues = Object.values(courseCount);

  const barData = {
    labels: courseLabels,
    datasets: [
      {
        label: 'Enrollments per Course',
        data: courseValues,
        backgroundColor: '#6d28d2',
      }
    ]
  };

  const pieData = {
    labels: courseLabels,
    datasets: [
      {
        data: courseValues,
        backgroundColor: [
          '#6d28d2', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe',
        ],
        borderWidth: 1
      }
    ]
  };

  // 🔹 Monthly Student Registration Trend
  const monthlyData = {};

  enrollments.forEach(entry => {
    const date = new Date(entry.submittedAt);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const monthLabels = Object.keys(monthlyData);
  const studentCounts = Object.values(monthlyData);

  const studentLineData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Monthly Student Registrations',
        data: studentCounts,
        fill: false,
        borderColor: '#6d28d2',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="dashboard-charts">
      <h2>Enrollment Charts</h2>
      <div className="dashboard-charts-wrapper">
        <div className="chart-container"><Bar data={barData} /></div>
        <div className="chart-container"><Pie data={pieData} /></div>
      </div>

      <h2>Students Trend</h2>
      <div className="dashboard-charts-wrapper">
        <div className="chart-container"><Line data={studentLineData} /></div>
      </div>
    </div>
  );
};

export default DashboardCharts;
