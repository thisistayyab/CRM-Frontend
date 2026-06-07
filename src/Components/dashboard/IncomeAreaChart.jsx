import PropTypes from 'prop-types';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import ChartEmptyState, { hasChartData } from './ChartEmptyState';

const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2, mb: 1 }}>
      {items.map((item) => (
        <Stack key={item.label} direction="row" sx={{ gap: 1, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}>
          <Box sx={{ width: 10, height: 10, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
          <Typography variant="caption" color="text.secondary">{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function IncomeAreaChart({ view, salesData = [], engagementData = [] }) {
  const theme = useTheme();
  const [visibility, setVisibility] = useState({ Revenue: true, Customers: true });

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const data1 = view === 'monthly'
    ? (salesData.length === 12 ? salesData : Array(12).fill(0))
    : (engagementData.length >= 7 ? engagementData.slice(-7) : Array(7).fill(0));
  const data2 = view === 'monthly'
    ? (engagementData.length === 12 ? engagementData : Array(12).fill(0))
    : Array(7).fill(0);

  const hasRevenue = hasChartData(data1);
  const hasCustomers = hasChartData(data2);
  const hasAnyData = hasRevenue || hasCustomers;

  if (!hasAnyData) {
    return (
      <ChartEmptyState
        height={320}
        icon="line"
        message={view === 'monthly' ? 'No revenue data yet' : 'No customer activity this week'}
        hint="Import Facebook orders or complete sales to see growth trends."
      />
    );
  }

  const line = theme.palette.divider;
  const toggleVisibility = (label) => setVisibility(prev => ({ ...prev, [label]: !prev[label] }));

  const visibleSeries = [
    hasRevenue && {
      data: data1, label: 'Revenue', showMark: true, area: true, id: 'Revenue',
      color: theme.palette.primary.main, visible: visibility['Revenue']
    },
    hasCustomers && {
      data: data2, label: 'Customers', showMark: true, area: true, id: 'Customers',
      color: theme.palette.success.main, visible: visibility['Customers']
    }
  ].filter(Boolean);

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, tickLabelStyle: axisFonstyle }]}
        yAxis={[{ tickLabelStyle: axisFonstyle, min: 0 }]}
        height={320}
        margin={{ top: 16, bottom: 24, right: 16, left: 48 }}
        series={visibleSeries.filter(s => s.visible).map(s => ({
          type: 'line', data: s.data, label: s.label, showMark: s.showMark, area: s.area,
          id: s.id, color: s.color, stroke: s.color, strokeWidth: 2, curve: 'natural'
        }))}
        sx={{
          '& .MuiAreaElement-series-Revenue': { fill: "url('#gradRevenue')", opacity: 0.35 },
          '& .MuiAreaElement-series-Customers': { fill: "url('#gradCustomers')", opacity: 0.35 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line }
        }}
      >
        <defs>
          <linearGradient id="gradRevenue" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.35)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0)} />
          </linearGradient>
          <linearGradient id="gradCustomers" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.success.main, 0.35)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0)} />
          </linearGradient>
        </defs>
      </LineChart>
      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}

Legend.propTypes = { items: PropTypes.array, onToggle: PropTypes.func };
IncomeAreaChart.propTypes = {
  view: PropTypes.oneOf(['monthly', 'weekly']),
  salesData: PropTypes.array,
  engagementData: PropTypes.array
};
