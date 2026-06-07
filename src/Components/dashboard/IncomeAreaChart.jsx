import PropTypes from 'prop-types';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
          <Typography variant="body2" color="text.primary">{item.label}</Typography>
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

  const line = theme.palette.divider;
  const toggleVisibility = (label) => setVisibility(prev => ({ ...prev, [label]: !prev[label] }));

  const visibleSeries = [
    {
      data: data1,
      label: 'Revenue',
      showMark: false,
      area: true,
      id: 'Revenue',
      color: theme.palette.primary.main || '',
      visible: visibility['Revenue']
    },
    {
      data: data2,
      label: 'Customers',
      showMark: false,
      area: true,
      id: 'Customers',
      color: theme.palette.success.main || '',
      visible: visibility['Customers']
    }
  ];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFonstyle }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
        height={450}
        margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
        series={visibleSeries
          .filter(s => s.visible)
          .map(s => ({
            type: 'line', data: s.data, label: s.label,
            showMark: s.showMark, area: s.area, id: s.id,
            color: s.color, stroke: s.color, strokeWidth: 2
          }))}
        sx={{
          '& .MuiAreaElement-series-Revenue': { fill: "url('#gradRevenue')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiAreaElement-series-Customers': { fill: "url('#gradCustomers')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line }
        }}
      >
        <defs>
          <linearGradient id="gradRevenue" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="gradCustomers" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.success.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
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
