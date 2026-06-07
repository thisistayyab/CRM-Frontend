import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart } from '@mui/x-charts/BarChart';
import ChartEmptyState, { hasChartData } from './ChartEmptyState';

function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay();
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

export default function MonthlyBarChart({ orders = [] }) {
  const theme = useTheme();
  const [weekIncome, setWeekIncome] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const days = getCurrentWeekDays();
    const incomeByDay = Array(days.length).fill(0);
    days.forEach((day, idx) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      orders.forEach(order => {
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
  }, [orders]);

  if (!hasChartData(weekIncome)) {
    return (
      <ChartEmptyState
        height={200}
        message="No sales this week"
        hint="Complete orders will show daily income here."
      />
    );
  }

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      hideLegend
      height={200}
      series={[{ data: weekIncome, label: 'Income (PKR)' }]}
      xAxis={[{ data: labels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ tickLabelStyle: axisFonstyle }]}
      slotProps={{ bar: { rx: 4, ry: 4 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 48, right: 16, top: 8, bottom: 28 }}
      colors={[theme.palette.primary.main]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.7 } }}
    />
  );
}

MonthlyBarChart.propTypes = {
  orders: PropTypes.array
};
