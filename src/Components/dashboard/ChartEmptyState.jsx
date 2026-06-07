import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChartOutlined';

export function hasChartData(values = []) {
  return Array.isArray(values) && values.some(v => Number(v) > 0);
}

export default function ChartEmptyState({ message = 'No data yet', hint, height = 280, icon = 'bar' }) {
  const Icon = icon === 'line' ? ShowChartIcon : BarChartIcon;

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'action.hover',
      }}
    >
      <Icon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5, opacity: 0.5 }} />
      <Typography variant="body1" color="text.secondary" fontWeight={600}>
        {message}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, maxWidth: 280 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

ChartEmptyState.propTypes = {
  message: PropTypes.string,
  hint: PropTypes.string,
  height: PropTypes.number,
  icon: PropTypes.oneOf(['bar', 'line'])
};
