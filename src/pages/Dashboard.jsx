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

// project imports
import MainCard from '../Components/dashboard/MainCard.jsx';
import AnalyticEcommerce from '../Components/dashboard/AnalyticEcommerce.jsx';
import MonthlyBarChart from '../Components/dashboard/MonthlyBarChart.jsx';
import ReportAreaChart from '../Components/dashboard/ReportAreaChart.jsx';
import UniqueVisitorCard from '../Components/dashboard/UniqueVisitorCard.jsx';
import SaleReportCard from '../Components/dashboard/SaleReportCard.jsx';
import OrdersTable from '../Components/dashboard/OrdersTable.jsx';

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

function getPreviousWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - dayOfWeek - 6);
  lastMonday.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(lastMonday);
    d.setDate(lastMonday.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [weekIncome, setWeekIncome] = useState(0);

  useEffect(() => {
    // fetch('http://localhost:8000/v1/api/product/orders/stats', { credentials: 'include' })
    fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders/stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setStats(data));

    // Fetch all orders to calculate previous week's income
    // fetch('http://localhost:8000/v1/api/product/orders', { credentials: 'include' })
    fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const days = getPreviousWeekDates();
          let total = 0;
          days.forEach(day => {
            const dayStart = new Date(day);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            data.data.forEach(order => {
              if (order.status === 'complete' && order.createdAt && order.totalPrice) {
                const date = new Date(order.createdAt);
                if (date >= dayStart && date <= dayEnd) {
                  total += order.totalPrice;
                }
              }
            });
          });
          setWeekIncome(total);
        }
      });
  }, []);

  if (!stats) return null;
  const { currentYear, lastYear } = stats;

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

  const userPercent = getPercent(currentYear.users, lastYear.users);
  const productPercent = getPercent(currentYear.products, lastYear.products);
  const orderPercent = getPercent(currentYear.orders, lastYear.orders);
  const salesPercent = getPercent(currentYear.sales, lastYear.sales);

  return (
    <Grid paddingTop={'30px'} marginLeft={'30px'} marginRight={'30px'} container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Customers" count={currentYear.users} percentage={Math.abs(userPercent).toFixed(1)} isLoss={getIsLoss(currentYear.users, lastYear.users)} color={getColor(currentYear.users, lastYear.users)} extra={currentYear.users} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Products" count={currentYear.products} percentage={Math.abs(productPercent).toFixed(1)} isLoss={getIsLoss(currentYear.products, lastYear.products)} color={getColor(currentYear.products, lastYear.products)} extra={currentYear.products} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Order" count={currentYear.orders} percentage={Math.abs(orderPercent).toFixed(1)} isLoss={getIsLoss(currentYear.orders, lastYear.orders)} color={getColor(currentYear.orders, lastYear.orders)} extra={currentYear.orders} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Sales" count= {`${currentYear.sales}PKR`} percentage={Math.abs(salesPercent).toFixed(1)} isLoss={getIsLoss(currentYear.sales, lastYear.sales)} color={getColor(currentYear.sales, lastYear.sales)} extra={currentYear.sales} />
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
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              divider
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
            </ListItem>
            <ListItem
              component={ListItemButton}
              secondaryAction={
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
            </ListItem>
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
  );
}
