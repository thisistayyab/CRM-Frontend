// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Monday as start of week
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart() {
  const theme = useTheme();
  const [weekIncome, setWeekIncome] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // fetch('http://localhost:8000/v1/api/product/orders', { credentials: 'include' })
    fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const days = getCurrentWeekDays();
          const incomeByDay = Array(days.length).fill(0);
          days.forEach((day, idx) => {
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            data.data.forEach(order => {
              if (order.status === 'complete' && order.createdAt && order.totalPrice) {
                const date = new Date(order.createdAt);
                if (date >= dayStart && date <= dayEnd) {
                  incomeByDay[idx] += order.totalPrice;
                }
              }
            });
          });
          setWeekIncome(incomeByDay);
          setLabels(days.map(d => d.toLocaleDateString(undefined, { weekday: 'short' })));
        }
      });
  }, []);

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      hideLegend
      height={380}
      series={[{ data: weekIncome, label: 'Income (PKR)' }]}
      xAxis={[{ data: labels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ position: 'none' }]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}
