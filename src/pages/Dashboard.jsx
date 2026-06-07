// material-ui
import Avatar from '@mui/material/Avatar';
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
import FacebookIcon from '@mui/icons-material/Facebook';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RepeatIcon from '@mui/icons-material/Repeat';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

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

const signalIcons = {
  'Facebook Inbox Orders': FacebookIcon,
  'Pending Fulfillment': PendingActionsIcon,
  'Repeat Customers': RepeatIcon,
  'Inventory Pressure': Inventory2OutlinedIcon,
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

import { useEffect, useState } from 'react';
import { api } from '../server.js';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import { getTintedAvatarSx } from '../utils/pageStyles';

export default function Dashboard() {
  const theme = useTheme();
  const [weekIncome, setWeekIncome] = useState(0);
  const [period, setPeriod] = useState('today');
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [storeEmail, setStoreEmail] = useState('');
  const [salesTrend, setSalesTrend] = useState([]);
  const [customerEngagement, setCustomerEngagement] = useState([]);
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
    Promise.all([
      fetch(`${api}/v1/api/product/orders`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${api}/v1/api/analytics/overview`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${api}/v1/api/analytics/dashboard`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${api}/v1/api/store/get-store`, { credentials: 'include' }).then(r => r.json())
    ])
      .then(([ordersRes, analyticsRes, insightsRes, storeRes]) => {
        if (ordersRes.data) {
          setOrders(ordersRes.data);
          const today = new Date();
          const dayOfWeek = today.getDay();
          const monday = new Date(today);
          monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
          monday.setHours(0, 0, 0, 0);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);
          const weekTotal = ordersRes.data
            .filter(order => order.status === 'complete' && order.createdAt && order.totalPrice)
            .filter(order => {
              const d = new Date(order.createdAt);
              return d >= monday && d <= sunday;
            })
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
          setWeekIncome(weekTotal);
        }
        if (analyticsRes.salesTrend) {
          setSalesTrend(analyticsRes.salesTrend.map(s => s.sales));
          setCustomerEngagement(analyticsRes.customerEngagement || []);
        }
        if (insightsRes.data) setInsights(insightsRes.data);
        if (storeRes.data?.email) setStoreEmail(storeRes.data.email);
        if (!ordersRes.data) {
          setAlert({ open: true, type: 'error', message: ordersRes.message || 'Error loading dashboard data.' });
          setAlertKey((k) => k + 1);
        }
        setLoading(false);
      })
      .catch(() => {
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
            <Grid sx={{ mb: -2.25, display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }} size={12}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5">Business Command Center</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your orders, customers, and inventory — updated live from your store data.
                </Typography>
              </Box>
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
            <Grid size={12}>
              <Grid container spacing={2}>
                {(insights?.growthSignals || []).map((system) => {
                  const Icon = signalIcons[system.title] || PendingActionsIcon;
                  return (
                    <Grid key={system.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                      <MainCard
                        sx={(theme) => ({
                          height: '100%',
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(203, 213, 225, 0.22)' : 'divider',
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))'
                            : theme.palette.background.paper
                        })}
                        contentSX={{ p: 2.25, height: '100%' }}
                      >
                        <Stack sx={{ gap: 1.5, height: '100%' }}>
                          <Avatar variant="rounded" sx={getTintedAvatarSx(theme, system.color)}>
                            <Icon sx={{ fontSize: 22 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{system.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {system.description}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }} />
                          <Typography variant="caption" color={`${system.color}.main`} fontWeight={700}>
                            {system.metric}
                          </Typography>
                        </Stack>
                      </MainCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Customers" count={currentStats.users} prevCount={prevStats.users} percentage={Math.abs(userPercent).toFixed(1)} isLoss={getIsLoss(currentStats.users, prevStats.users)} color={getColor(currentStats.users, prevStats.users)} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Products" count={currentStats.products} prevCount={prevStats.products} percentage={Math.abs(productPercent).toFixed(1)} isLoss={getIsLoss(currentStats.products, prevStats.products)} color={getColor(currentStats.products, prevStats.products)} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Order" count={currentStats.orders} prevCount={prevStats.orders} percentage={Math.abs(orderPercent).toFixed(1)} isLoss={getIsLoss(currentStats.orders, prevStats.orders)} color={getColor(currentStats.orders, prevStats.orders)} period={period} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AnalyticEcommerce title="Total Sales" count={currentStats.sales} prevCount={prevStats.sales} percentage={Math.abs(salesPercent).toFixed(1)} isLoss={getIsLoss(currentStats.sales, prevStats.sales)} color={getColor(currentStats.sales, prevStats.sales)} period={period} />
            </Grid>
            <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
            {/* row 2 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <UniqueVisitorCard salesData={salesTrend} engagementData={customerEngagement} />
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
                <MonthlyBarChart orders={orders} />
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
                <OrdersTable orders={orders} />
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
                <>
                  <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                      <ListItemButton divider>
                        <ListItemText primary="Profit Growth (This Month)" />
                        <Typography variant="h5" color={insights?.profitGrowth >= 0 ? 'success.main' : 'error.main'}>
                          {insights ? `${insights.profitGrowth >= 0 ? '+' : ''}${insights.profitGrowth}%` : '-'}
                        </Typography>
                      </ListItemButton>
                      <ListItemButton divider>
                        <ListItemText primary="Expense Ratio" />
                        <Typography variant="h5">{insights ? `${insights.expenseRatio}%` : '-'}</Typography>
                      </ListItemButton>
                      <ListItemButton divider>
                        <ListItemText primary="Cancel/Return Rate" />
                        <Typography variant="h5">{insights ? `${insights.cancelRate}%` : '-'}</Typography>
                      </ListItemButton>
                      <ListItemButton>
                        <ListItemText primary="Business Risk" />
                        <Typography variant="h5" color={
                          insights?.riskLevel === 'High' ? 'error.main' :
                          insights?.riskLevel === 'Medium' ? 'warning.main' : 'success.main'
                        }>
                          {insights?.riskLevel || '-'}
                        </Typography>
                      </ListItemButton>
                    </List>
                    <Box sx={{ px: 2, pb: 2 }}>
                      <ReportAreaChart
                        data={insights?.profitTrend?.map(p => p.value) || []}
                        labels={insights?.profitTrend?.map(p => p.label) || []}
                      />
                    </Box>
                </>
              </MainCard>
            </Grid>
            {/* row 4 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <SaleReportCard orders={orders} />
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
                    {orders.filter(o => o.status === 'complete').length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">No completed transactions yet.</Typography>
                      </Box>
                    ) : (orders.filter(o => o.status === 'complete')
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
                          <Avatar sx={getTintedAvatarSx(theme, 'primary', 36)}>
                            <CardGiftcardOutlinedIcon sx={{ fontSize: 18 }} />
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
                <Stack sx={{ gap: 2 }}>
                  <Typography variant="h5">Low Stock Alerts</Typography>
                  {insights?.lowStockItems?.length > 0 ? (
                    insights.lowStockItems.map((item, idx) => (
                      <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" noWrap sx={{ maxWidth: '60%' }}>{item.productName}</Typography>
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          {item.quantity} / {item.minStock}
                        </Typography>
                      </Stack>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">All stock levels are healthy.</Typography>
                  )}
                  {storeEmail && (
                    <Button size="small" variant="contained" href={`mailto:${storeEmail}`}
                      sx={{ textTransform: 'capitalize', mt: 1 }}>
                      Contact Support
                    </Button>
                  )}
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </motion.div>
      )}
    </>
  );
}
