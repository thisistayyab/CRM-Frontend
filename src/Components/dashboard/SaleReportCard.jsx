import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import SalesChart from './SalesChart.jsx';

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'week',
    label: 'This Week'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function SaleReportCard({ orders = [] }) {
  const [value, setValue] = useState('today');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Sales Report</Typography>
        </Grid>
        <Grid>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <SalesChart period={value} orders={orders} />
    </>
  );
}

SaleReportCard.propTypes = { orders: PropTypes.array };
