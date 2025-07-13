// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MenuItem, TextField } from '@mui/material';

// project imports
import MainCard from '../Components/dashboard/MainCard.jsx';
import AnalyticEcommerce from '../Components/dashboard/AnalyticEcommerce.jsx';
import MonthlyBarChart from '../Components/dashboard/MonthlyBarChart.jsx';
import ReportAreaChart from '../Components/dashboard/ReportAreaChart.jsx';
import UniqueVisitorCard from '../Components/dashboard/UniqueVisitorCard.jsx';
import SaleReportCard from '../Components/dashboard/SaleReportCard.jsx';
import OrdersTable from '../Components/dashboard/OrdersTable.jsx';
import MIUIAlert from '../Components/MIUIAlert.jsx'
import MIUILoader from '../Components/MIUILoader.jsx';

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from '../assets/images/users/avatar-1.png';
import avatar2 from '../assets/images/users/avatar-2.png';
import avatar3 from '../assets/images/users/avatar-3.png';
import avatar4 from '../assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

import { useEffect, useState } from 'react';
import { api } from '../server.js';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

function getLast7DaysExcludingToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 7; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [weekIncome, setWeekIncome] = useState(0);
  const [period, setPeriod] = useState('today');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  // Helper to get period ranges
  function getPeriodRange(period, offset = 0) {
    const now = new Date();
    let start, end;
    if (period === 'today') {
      start = new Date(now);
      start.setDate(now.getDate() + offset);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    } else if (period === 'week') {
      // Monday as start of week
      start = new Date(now);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1) + offset * 7;
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth() + offset, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
      start = new Date(now.getFullYear() + offset, 0, 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear() + offset, 11, 31, 23, 59, 59, 999);
    }
    return [start, end];
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${api}/v1/api/product/orders`, { credentials: 'include' })
    // fetch('http://localhost:8000/v1/api/product/orders', { credentials: 'include' })
    // fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setOrders(data.data);
          // Calculate this week's income (Monday to Sunday)
          const today = new Date();
          const dayOfWeek = today.getDay();
          const monday = new Date(today);
          monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
          monday.setHours(0, 0, 0, 0);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);
          const weekTotal = data.data
            .filter(order => order.status === 'complete' && order.createdAt && order.totalPrice)
            .filter(order => {
              const d = new Date(order.createdAt);
              return d >= monday && d <= sunday;
            })
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
          setWeekIncome(weekTotal);
        } else {
          setAlert({ open: true, type: 'error', message: data.message || 'Error loading dashboard data.' });
          setAlertKey((k) => k + 1);
        }
        setLoading(false);
      })
      .catch(err => {
        setAlert({ open: true, type: 'error', message: 'Error loading dashboard data.' });
        setAlertKey((k) => k + 1);
        setLoading(false);
      });
  }, []);


  // Calculate stats for selected period and previous period
  function getStatsForPeriod(period, offset = 0) {
    const [start, end] = getPeriodRange(period, offset);
    const filtered = orders.filter(order => {
      if (!order.createdAt) return false;
      const d = new Date(order.createdAt);
      return d >= start && d <= end;
    });
    const users = new Set(filtered.map(o => o.phoneNumber)).size;
    const products = new Set(filtered.flatMap(o => o.item.map(i => i.product && i.product._id))).size;
    const ordersCount = filtered.length;
    const sales = filtered.filter(o => o.status === 'complete').reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    return { users, products, orders: ordersCount, sales };
  }

  const currentStats = getStatsForPeriod(period, 0);
  const prevStats = getStatsForPeriod(period, -1);

  const getPercent = (current, last) => {
    if (last === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return ((current - last) / last) * 100;
  };
  const getColor = (current, last) => {
    if (last === 0 && current > 0) return 'primary';
    return (current - last) >= 0 ? 'primary' : 'warning';
  };
  const getIsLoss = (current, last) => {
    if (last === 0 && current > 0) return false;
    return (current - last) < 0;
  };

  const userPercent = getPercent(currentStats.users, prevStats.users);
  const productPercent = getPercent(currentStats.products, prevStats.products);
  const orderPercent = getPercent(currentStats.orders, prevStats.orders);
  const salesPercent = getPercent(currentStats.sales, prevStats.sales);

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
        mode={theme.palette.mode}
      />
      {loading ? (
        <Box sx={{ width: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MIUILoader message="Loading dashboard..." />
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Grid paddingTop={'30px'} marginLeft={'30px'} marginRight={'30px'} container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid sx={{ mb: -2.25, display: 'flex', alignItems: 'center', gap: 2 }} size={12}>
              <Typography variant="h5">Dashboard</Typography>
              <TextField
                select
                size="small"
                value={period}
                onChange={e => setPeriod(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="today">Today vs Yesterday</MenuItem>
                <MenuItem value="week">This Week vs Last Week</MenuItem>
                <MenuItem value="month">This Month vs Last Month</MenuItem>
                <MenuItem value="year">This Year vs Last Year</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Customers" count={currentStats.users} prevCount={prevStats.users} percentage={Math.abs(userPercent).toFixed(1)} isLoss={getIsLoss(currentStats.users, prevStats.users)} color={getColor(currentStats.users, prevStats.users)} extra={currentStats.users} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Products" count={currentStats.products} prevCount={prevStats.products} percentage={Math.abs(productPercent).toFixed(1)} isLoss={getIsLoss(currentStats.products, prevStats.products)} color={getColor(currentStats.products, prevStats.products)} extra={currentStats.products} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Order" count={currentStats.orders} prevCount={prevStats.orders} percentage={Math.abs(orderPercent).toFixed(1)} isLoss={getIsLoss(currentStats.orders, prevStats.orders)} color={getColor(currentStats.orders, prevStats.orders)} extra={currentStats.orders} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Sales" count={currentStats.sales} prevCount={prevStats.sales} percentage={Math.abs(salesPercent).toFixed(1)} isLoss={getIsLoss(currentStats.sales, prevStats.sales)} color={getColor(currentStats.sales, prevStats.sales)} extra={currentStats.sales} period={period} />
            </Grid>
            <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
            {/* row 2 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <UniqueVisitorCard />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="h5">Income Overview</Typography>
                </Grid>
                <Grid />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Stack sx={{ gap: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      This Week Statistics
                    </Typography>
                    <Typography variant="h3">PKR {weekIncome.toLocaleString()}</Typography>
                  </Stack>
                </Box>
                <MonthlyBarChart />
              </MainCard>
            </Grid>
            {/* row 3 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="h5">Recent Orders</Typography>
                </Grid>
                <Grid />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <OrdersTable />
              </MainCard>
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="h5">Analytics Report</Typography>
                </Grid>
                <Grid />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                  <ListItemButton divider>
                    <ListItemText primary="Company Finance Growth" />
                    <Typography variant="h5">+45.14%</Typography>
                  </ListItemButton>
                  <ListItemButton divider>
                    <ListItemText primary="Company Expenses Ratio" />
                    <Typography variant="h5">0.58%</Typography>
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemText primary="Business Risk Cases" />
                    <Typography variant="h5">Low</Typography>
                  </ListItemButton>
                </List>
                <ReportAreaChart />
              </MainCard>
            </Grid>
            {/* row 4 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <SaleReportCard />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                  <Typography variant="h5">Transaction History</Typography>
                </Grid>
                <Grid />
              </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                <List
                  component="nav"
                  sx={{
                    px: 0,
                    py: 0,
                    '& .MuiListItemButton-root': {
                      py: 1.5,
                      px: 2,
                      '& .MuiAvatar-root': avatarSX,
                      '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                    }
                  }}
                >
                  {(orders.filter(o => o.status === 'complete')
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3)
                  ).map((order, idx) => (
                    <ListItem
                      key={order._id}
                      component={ListItemButton}
                      divider={idx < 2}
                      secondaryAction={
                        <Stack sx={{ alignItems: 'flex-end' }}>
                          <Typography variant="subtitle1" noWrap>
                            PKR {order.totalPrice?.toLocaleString()}
                          </Typography>
                        </Stack>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                          <GiftOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1">Order #{order.orderId}</Typography>}
                        secondary={order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                      />
                    </ListItem>
                  ))}
                </List>
              </MainCard>
              <MainCard sx={{ mt: 2 }}>
                <Stack sx={{ gap: 3 }}>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid>
                      <Stack>
                        <Typography variant="h5" noWrap>
                          Help & Support Chat
                        </Typography>
                        <Typography variant="caption" color="secondary" noWrap>
                          Typical replay within 5 min
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                        <Avatar alt="Remy Sharp" src={avatar1} />
                        <Avatar alt="Travis Howard" src={avatar2} />
                        <Avatar alt="Cindy Baker" src={avatar3} />
                        <Avatar alt="Agnes Walker" src={avatar4} />
                      </AvatarGroup>
                    </Grid>
                  </Grid>
                  <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                    Need Help?
                  </Button>
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </>
  );
}
