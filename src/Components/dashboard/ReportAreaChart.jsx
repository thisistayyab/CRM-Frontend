import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { chartsGridClasses, LineChart } from '@mui/x-charts';
import ChartEmptyState, { hasChartData } from './ChartEmptyState';

export default function ReportAreaChart({ data = [], labels = [] }) {
  const theme = useTheme();

  if (!hasChartData(data)) {
    return (
      <ChartEmptyState
        height={180}
        icon="line"
        message="No profit history yet"
        hint="Profit trend appears after you complete orders."
      />
    );
  }

  const axisFonstyle = { fill: theme.palette.text.secondary, fontSize: 10 };

  return (
    <LineChart
      hideLegend
      grid={{ horizontal: true }}
      xAxis={[{ data: labels, scaleType: 'point', tickLabelStyle: axisFonstyle }]}
      yAxis={[{ tickLabelStyle: axisFonstyle, min: 0 }]}
      series={[{
        data,
        showMark: true,
        id: 'ProfitTrend',
        color: theme.palette.warning.main,
        label: 'Profit',
        curve: 'natural',
        area: true
      }]}
      height={180}
      margin={{ top: 12, bottom: 28, left: 48, right: 16 }}
      sx={{
        '& .MuiLineElement-root': { strokeWidth: 2 },
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', opacity: 0.4 }
      }}
    />
  );
}

ReportAreaChart.propTypes = {
  data: PropTypes.array,
  labels: PropTypes.array
};
