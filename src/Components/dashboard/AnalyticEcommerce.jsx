import PropTypes from 'prop-types';
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from './MainCard.jsx';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, period = 'year', prevCount }) {
  // Dynamic period label
  let periodLabel = 'this year';
  if (period === 'today') periodLabel = 'today';
  else if (period === 'week') periodLabel = 'this week';
  else if (period === 'month') periodLabel = 'this month';
  else if (period === 'year') periodLabel = 'this year';

  // Use raw numbers for diff calculation
  let isCurrency = false;
  let curr = Number(count);
  let prev = Number(prevCount);
  if (title && title.toLowerCase().includes('sales')) {
    isCurrency = true;
    curr = Number(count);
    prev = Number(prevCount);
  }
  const diff = curr - prev;

  // Info sentence logic
  let infoSentence = '';
  if (diff > 0) {
    infoSentence = `You made extra ${isCurrency ? `PKR ${diff.toLocaleString()}` : diff} ${periodLabel}`;
  } else if (diff < 0) {
    infoSentence = `You made ${isCurrency ? `PKR ${Math.abs(diff).toLocaleString()}` : Math.abs(diff)} less ${periodLabel}`;
  } else {
    infoSentence = `No change ${periodLabel}`;
  }

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid>
            <Typography variant="h4" color="inherit">
              {isCurrency ? `PKR ${curr.toLocaleString()}` : curr}
            </Typography>
          </Grid>
          {percentage && (
            <Grid>
              <Chip
                variant="combined"
                color={color}
                icon={isLoss
                  ? <TrendingDownIcon sx={{ fontSize: '1rem !important' }} />
                  : <TrendingUpIcon sx={{ fontSize: '1rem !important' }} />}
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          {infoSentence}
        </Typography>
      </Box>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  period: PropTypes.string,
  prevCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
