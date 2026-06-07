import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { chartsGridClasses, LineChart } from '@mui/x-charts';

export default function ReportAreaChart({ data = [], labels = [] }) {
  const theme = useTheme();
  const axisFonstyle = { fill: theme.palette.text.secondary };
  const chartData = data.length ? data : [0];
  const chartLabels = labels.length ? labels : ['—'];

  return (
    <LineChart
      hideLegend
      grid={{ horizontal: true }}
      xAxis={[{ data: chartLabels, scaleType: 'point', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ position: 'none', tickMaxStep: 10 }]}
      series={[{
        data: chartData,
        showMark: false,
        id: 'ProfitTrend',
        color: theme.palette.warning.main,
        label: 'Profit'
      }]}
      height={340}
      margin={{ top: 30, bottom: 25, left: 20, right: 20 }}
      sx={{ '& .MuiLineElement-root': { strokeWidth: 1 }, [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' } }}
    />
  );
}

ReportAreaChart.propTypes = {
  data: PropTypes.array,
  labels: PropTypes.array
};
