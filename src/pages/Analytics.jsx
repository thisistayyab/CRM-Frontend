import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Card, CardContent, CardHeader, Divider, Grid, Avatar, Chip, CircularProgress } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarIcon from '@mui/icons-material/Star';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { api } from '../server';
import { useTheme } from '@mui/material/styles';

const COLORS = ['#1976d2', '#ff9800', '#43a047', '#e91e63'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(false);
  const theme = useTheme();
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${api}/v1/api/analytics/overview`, { credentials: 'include' });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        // Check for valid data structure
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setAnalytics(data);
          setError(false);
        } else {
          setAnalytics(null);
          setError(true);
        }
      } catch (err) {
        setAnalytics(null);
        setError(true);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ textAlign: 'center', mt: 8 }}><Typography color="error">Unable to fetch analytics data. Please try again later.</Typography></Box>;
  if (!analytics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <InsightsIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">Analytics Dashboard</Typography>
          <Chip label="Live" color="success" sx={{ ml: 2, fontWeight: 600 }} />
        </Box>
        {/* Performance Cards Row */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MonetizationOnIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Revenue</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">Rs {analytics.revenue.toLocaleString()}</Typography>
                <Typography variant="body2">This Month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Orders</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analytics.orders}</Typography>
                <Typography variant="body2">Total Orders</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Customers</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">{analytics.customers}</Typography>
                <Typography variant="body2">Active</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ borderRadius: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Top Product</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">{analytics.topProduct.name}</Typography>
                <Typography variant="body2">Best Seller</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Sales Overview Section */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><BarChartIcon /></Avatar>}
            title={<Typography variant="h6" fontWeight="bold">Sales Overview</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">Monthly sales trend</Typography>}
          />
          <Divider />
          <CardContent>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.salesTrend}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
        {/* Revenue & Orders Row */}
        <Grid container gap={'2%'} mb={4} rowGap={4} flexWrap="wrap" >
          <Grid item sx={{ width: { xs: '100%', md: '49%' } }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                title={<Typography variant="h6" fontWeight="bold">Revenue Breakdown</Typography>}
                subheader={<Typography variant="body2" color="text.secondary">By category</Typography>}
              />
              <Divider />
              <CardContent>
                <Box sx={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.revenueBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        {analytics.revenueBreakdown.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sx={{ width: { xs: '100%', md: '49%' } }}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardHeader
                title={<Typography variant="h6" fontWeight="bold">Order Trends</Typography>}
                subheader={<Typography variant="body2" color="text.secondary">Weekly orders</Typography>}
              />
              <Divider />
              <CardContent>
                <Box sx={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.orderTrends}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Top Products Section */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardHeader
            title={<Typography variant="h6" fontWeight="bold">Top Products</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">Best selling products this month</Typography>}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              {analytics.topProducts.map((prod, idx) => (
                <Grid item xs={12} sm={6} md={3} key={prod.name}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? '#232946' : '#f8fafc',
                      color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
                      p: 2,
                      textAlign: 'center',
                      boxShadow: theme.palette.mode === 'dark' ? 3 : 1,
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1, bgcolor: 'primary.light' }}>
                      <ShoppingCartIcon fontSize="large" />
                    </Avatar>
                    <Typography fontWeight="bold">{prod.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Rs {prod.revenue.toLocaleString()}</Typography>
                    <Typography variant="caption" color="success.main">{prod.sold} sold</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
        {/* Customer Insights Section */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardHeader
            title={<Typography variant="h6" fontWeight="bold">Customer Insights</Typography>}
            subheader={<Typography variant="body2" color="text.secondary">Engagement and retention</Typography>}
          />
          <Divider />
          <CardContent>
            <Grid container gap={'2%'} mb={4} rowGap={4} flexWrap="wrap" >
              <Grid item sx={{ width: { xs: '100%', md: '49%' } }}>
                <Box sx={{ height: 120 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.customerRetention.map((v, i) => ({ week: `W${i+1}`, retention: v }))}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="retention" stroke="#43a047" fill="#c8e6c9" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Typography align="center" variant="body2" color="text.secondary">Customer Retention</Typography>
              </Grid>
              <Grid item sx={{ width: { xs: '100%', md: '49%' } }}>
                <Box sx={{ height: 120 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.customerEngagement.map((v, i) => ({ week: `W${i+1}`, engagement: v }))}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="engagement" stroke="#1976d2" fill="#bbdefb" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Typography align="center" variant="body2" color="text.secondary">Customer Engagement</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          <Typography variant="body2">More analytics coming soon...</Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Analytics;