import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from './MainCard.jsx';
import ChartEmptyState, { hasChartData } from './ChartEmptyState';
// ==============================|| SALES COLUMN CHART ||============================== //

export default function SalesChart({ period = 'today', orders = [] }) {
  const theme = useTheme();

  const [showIncome, setShowIncome] = useState(true);
  const [showCostOfSales, setShowCostOfSales] = useState(true);

  // Fix: define handlers before use
  const handleIncomeChange = () => {
    setShowIncome((prev) => !prev);
  };
  const handleCostOfSalesChange = () => {
    setShowCostOfSales((prev) => !prev);
  };
  // Helper to get start of week (Monday)
  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Helper to filter orders by period
  function filterOrdersByPeriod(orders, period) {
    const now = new Date();
    if (period === 'today') {
      return orders.filter(order => {
        if (!order.createdAt) return false;
        const d = new Date(order.createdAt);
        return d.toDateString() === now.toDateString() && order.status === 'complete';
      });
    } else if (period === 'week') {
      const startOfWeek = getStartOfWeek(now);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return orders.filter(order => {
        if (!order.createdAt) return false;
        const d = new Date(order.createdAt);
        return d >= startOfWeek && d <= endOfWeek && order.status === 'complete';
      });
    } else if (period === 'month') {
      return orders.filter(order => {
        if (!order.createdAt) return false;
        const d = new Date(order.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && order.status === 'complete';
      });
    } else if (period === 'year') {
      return orders.filter(order => {
        if (!order.createdAt) return false;
        const d = new Date(order.createdAt);
        return d.getFullYear() === now.getFullYear() && order.status === 'complete';
      });
    }
    return [];
  }

  // Aggregate data for chart
  const filteredOrders = filterOrdersByPeriod(orders, period);
  let income = 0, costOfSales = 0, netProfit = 0;
  let chartLabels = [], incomeData = [], costData = [];
  if (period === 'year') {
    chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 0; m < 12; m++) {
      let monthIncome = 0, monthCost = 0, monthProfit = 0;
      filteredOrders.forEach(order => {
        const d = new Date(order.createdAt);
        if (d.getMonth() === m) {
          if (Array.isArray(order.item)) {
            order.item.forEach(i => {
              monthIncome += (typeof i.salePrice === 'number' ? i.salePrice : i.price) * i.quantity;
              monthCost += i.price * i.quantity;
            });
          }
          if (typeof order.netProfit === 'number') monthProfit += order.netProfit;
        }
      });
      incomeData.push(monthIncome);
      costData.push(monthCost);
      income += monthIncome;
      costOfSales += monthCost;
      netProfit += monthProfit;
    }
  } else if (period === 'month') {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    chartLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    for (let d = 1; d <= daysInMonth; d++) {
      let dayIncome = 0, dayCost = 0, dayProfit = 0;
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt);
        if (date.getDate() === d) {
          if (Array.isArray(order.item)) {
            order.item.forEach(i => {
              dayIncome += (typeof i.salePrice === 'number' ? i.salePrice : i.price) * i.quantity;
              dayCost += i.price * i.quantity;
            });
          }
          if (typeof order.netProfit === 'number') dayProfit += order.netProfit;
        }
      });
      incomeData.push(dayIncome);
      costData.push(dayCost);
      income += dayIncome;
      costOfSales += dayCost;
      netProfit += dayProfit;
    }
  } else if (period === 'week') {
    // Get start of week (Monday)
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);
    chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let d = 0; d < 7; d++) {
      let dayIncome = 0, dayCost = 0, dayProfit = 0;
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + d);
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt);
        if (date.toDateString() === dayDate.toDateString()) {
          if (Array.isArray(order.item)) {
            order.item.forEach(i => {
              dayIncome += (typeof i.salePrice === 'number' ? i.salePrice : i.price) * i.quantity;
              dayCost += i.price * i.quantity;
            });
          }
          if (typeof order.netProfit === 'number') dayProfit += order.netProfit;
        }
      });
      incomeData.push(dayIncome);
      costData.push(dayCost);
      income += dayIncome;
      costOfSales += dayCost;
      netProfit += dayProfit;
    }
  } else if (period === 'today') {
    chartLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    for (let h = 0; h < 24; h++) {
      let hourIncome = 0, hourCost = 0, hourProfit = 0;
      filteredOrders.forEach(order => {
        const date = new Date(order.createdAt);
        if (date.getHours() === h) {
          if (Array.isArray(order.item)) {
            order.item.forEach(i => {
              hourIncome += (typeof i.salePrice === 'number' ? i.salePrice : i.price) * i.quantity;
              hourCost += i.price * i.quantity;
            });
          }
          if (typeof order.netProfit === 'number') hourProfit += order.netProfit;
        }
      });
      incomeData.push(hourIncome);
      costData.push(hourCost);
      income += hourIncome;
      costOfSales += hourCost;
      netProfit += hourProfit;
    }
  }

  const valueFormatter = (value) => `PKR ${value.toLocaleString()}`;
  const primaryColor = theme.palette.primary.main;
  const warningColor = theme.palette.warning.main;

  // Dynamically adjust bar gap and label font size based on number of bars and data range
  let barGap = 2;
  let fontSize = 12;
  if (chartLabels.length > 15) {
    barGap = 1;
    fontSize = 9;
  } else if (chartLabels.length > 7) {
    barGap = 1.5;
    fontSize = 10;
  }
  // If the data range is very large, reduce font size
  const maxValue = Math.max(...incomeData, ...costData, 0);
  if (maxValue > 1000000) fontSize = 10;

  // Dynamically calculate y-axis tick step to show at most 13 labels
  let yTickStep = 1;
  let yTicks = [0];
  if (maxValue > 0) {
    yTickStep = Math.ceil(maxValue / 13);
    // Round to nearest 10, 50, 100, 500, 1000, etc. for cleaner labels
    const pow10 = Math.pow(10, Math.floor(Math.log10(yTickStep)));
    yTickStep = Math.ceil(yTickStep / pow10) * pow10;
    // Generate ticks array
    yTicks = [];
    for (let v = 0; v <= maxValue; v += yTickStep) {
      yTicks.push(v);
    }
    // Ensure last tick is at least maxValue
    if (yTicks[yTicks.length - 1] < maxValue) {
      yTicks.push(yTicks[yTicks.length - 1] + yTickStep);
    }
    // If more than 13, reduce
    while (yTicks.length > 13) {
      yTicks = yTicks.filter((_, i) => i % 2 === 0);
    }
  }

  const axisFonstyle = { fontSize, fill: theme.palette.text.secondary };
  const noSalesData = !filteredOrders.length || !hasChartData(incomeData);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: noSalesData ? 2.5 : 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: noSalesData ? 2 : 0 }}>
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Net Profit
            </Typography>
            <Typography variant="h4">PKR {netProfit.toLocaleString()}</Typography>
          </Box>
          {!noSalesData && (
            <FormGroup>
              <Stack direction="row">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showIncome}
                      onChange={handleIncomeChange}
                      sx={{ '&.Mui-checked': { color: warningColor }, '&:hover': { backgroundColor: alpha(warningColor, 0.08) } }}
                    />
                  }
                  label="Income"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showCostOfSales}
                      onChange={handleCostOfSalesChange}
                      sx={{ '&.Mui-checked': { color: primaryColor } }}
                    />
                  }
                  label="Cost of Sales"
                />
              </Stack>
            </FormGroup>
          )}
        </Stack>

        {noSalesData ? (
          <ChartEmptyState
            height={260}
            message="No sales for this period"
            hint="Switch the period or complete more orders to see the report."
          />
        ) : (
        <BarChart
          hideLegend
          height={380}
          grid={{ horizontal: true }}
          xAxis={[{ id: 'sales-x-axis', data: chartLabels, scaleType: 'band', tickLabelStyle: { ...axisFonstyle, fontSize } }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle, ticks: yTicks }]}
          series={[
            showIncome ? { data: incomeData, label: 'Income', color: warningColor, valueFormatter, type: 'bar', barGap } : null,
            showCostOfSales ? { data: costData, label: 'Cost of Sales', color: primaryColor, valueFormatter, type: 'bar', barGap } : null
          ].filter(Boolean)}
          slotProps={{ bar: { rx: 5, ry: 5 }, tooltip: { trigger: 'item' } }}
          axisHighlight={{ x: 'none' }}
          margin={{ top: 30, left: -5, bottom: 25, right: 10 }}
          sx={{
            '& .MuiBarElement-root:hover': { opacity: 0.6 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider }
          }}
        />
        )}
      </Box>
    </MainCard>
  );
}

SalesChart.propTypes = {
  period: PropTypes.string,
  orders: PropTypes.array
};
