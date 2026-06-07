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

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Customer & Revenue Growth</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button size="small" onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}>
              Month
            </Button>
            <Button size="small" onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}>
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
