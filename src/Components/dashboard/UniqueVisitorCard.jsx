import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from './MainCard.jsx';
import IncomeAreaChart from './IncomeAreaChart.jsx';

export default function UniqueVisitorCard({ salesData = [], engagementData = [] }) {
  const [view, setView] = useState('monthly');
  const getViewButtonSx = (active) => ({
    minWidth: 82,
    borderRadius: 1,
    fontWeight: 600,
    color: active ? 'primary.main' : 'text.secondary',
    borderColor: active ? 'primary.main' : 'transparent',
    bgcolor: active ? 'transparent' : 'transparent',
    '&:hover': {
      color: active ? 'primary.main' : 'text.primary',
      borderColor: active ? 'primary.main' : 'divider',
      bgcolor: 'action.hover'
    }
  });

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Customer & Revenue Growth</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => setView('monthly')}
              variant={view === 'monthly' ? 'outlined' : 'text'}
              sx={getViewButtonSx(view === 'monthly')}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              variant={view === 'weekly' ? 'outlined' : 'text'}
              sx={getViewButtonSx(view === 'weekly')}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view={view} salesData={salesData} engagementData={engagementData} />
        </Box>
      </MainCard>
    </>
  );
}

UniqueVisitorCard.propTypes = {
  salesData: PropTypes.array,
  engagementData: PropTypes.array
};
