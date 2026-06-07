import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Avatar
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import RepeatIcon from '@mui/icons-material/Repeat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { api } from '../server';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { motion } from 'framer-motion';

const segmentConfig = {
  VIP: { color: 'warning', icon: <StarIcon fontSize="small" /> },
  Repeat: { color: 'primary', icon: <RepeatIcon fontSize="small" /> },
  New: { color: 'success', icon: <PersonAddIcon fontSize="small" /> }
};

const Customers = () => {
  const [searchParams] = useSearchParams();
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);

  useEffect(() => {
    fetch(`${api}/v1/api/analytics/customers`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setCustomers(data.data.customers || []);
          setSummary(data.data.summary || null);
        } else {
          setAlert({ open: true, type: 'error', message: data.message || 'Failed to load customers.' });
          setAlertKey(k => k + 1);
        }
        setLoading(false);
      })
      .catch(() => {
        setAlert({ open: true, type: 'error', message: 'Failed to load customers.' });
        setAlertKey(k => k + 1);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(c =>
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <MIUILoader message="Loading customers..." />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <MIUIAlert open={alert.open} type={alert.type} message={alert.message}
        onClose={() => setAlert(a => ({ ...a, open: false }))} alertKey={alertKey} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PeopleIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Customers</Typography>
            <Typography variant="body2" color="text.secondary">
              Smart customer insights powered by your order history
            </Typography>
          </Box>
        </Box>

        {summary && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Customers', value: summary.totalCustomers, color: 'primary.main' },
              { label: 'VIP Customers', value: summary.vipCustomers, color: 'warning.main' },
              { label: 'Repeat Buyers', value: summary.repeatCustomers, color: 'info.main' },
              { label: 'Total Revenue', value: `PKR ${summary.totalRevenue?.toLocaleString()}`, color: 'success.main' }
            ].map(stat => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color={stat.color}>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <TextField
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ mb: 3, maxWidth: 400 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Total Spent</TableCell>
                <TableCell>Last Order</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No customers found. Create orders to build your customer base.</Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.map(customer => {
                const seg = segmentConfig[customer.segment] || segmentConfig.New;
                return (
                  <TableRow key={customer.phoneNumber} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: 14 }}>
                          {customer.customerName?.charAt(0)?.toUpperCase() || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{customer.customerName}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.85, maxWidth: 150, display: 'block' }} noWrap>
                            {customer.customerAddress}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>
                      <Chip size="small" label={customer.segment} color={seg.color}
                        icon={seg.icon} variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{customer.totalOrders}</TableCell>
                    <TableCell align="right">PKR {customer.totalSpent?.toLocaleString()}</TableCell>
                    <TableCell>
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Link to={`/customer-orders/${customer.phoneNumber}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Chip label="View Orders" size="small" color="primary" clickable />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
};

export default Customers;
