// material-ui
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

function getPreviousWeekDates() {
  // Returns array of 7 Date objects for previous week (Mon-Sun)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Find last Monday
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - dayOfWeek - 6);
  lastMonday.setHours(0, 0, 0, 0);
  // Build array for last week (Mon-Sun)
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(lastMonday);
    d.setDate(lastMonday.getDate() + i);
    days.push(d);
  }
  return days;
}

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart() {
  const theme = useTheme();
  const [weekIncome, setWeekIncome] = useState(Array(7).fill(0));
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // fetch('http://localhost:8000/v1/api/product/orders', { credentials: 'include' })
    fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const days = getPreviousWeekDates();
          const incomeByDay = Array(7).fill(0);
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
          setLabels(days.map(d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })));
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
