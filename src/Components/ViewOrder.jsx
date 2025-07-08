import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, Avatar, Link, Chip
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MIUIAlert from './MIUIAlert';

const statusColors = {
  active: 'success',
  canceled: 'error',
  returned: 'warning',
  complete: 'primary',
};

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  // const API_URL = `http://localhost:8000/v1/api/product/orders/${id}`;
  const API_URL = `https://crm-backend-rho-weld.vercel.app/v1/api/product/orders/${id}`;

  useEffect(() => {
    fetch(API_URL, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setOrder(data.data);
          setComments(data.data.comments || []);
        }
      })
      .catch(err => {
        setAlert({ open: true, type: 'error', message: 'Error fetching order.' });
        setAlertKey((k) => k + 1);
      });
  }, [id]);

  if (!order) return <Typography>Loading order...</Typography>;

  const subtotal = order.item.reduce((sum, i) => sum + (i.salePrice || i.price) * i.quantity, 0);
  const total = subtotal + order.shippingCharges;
  const netProfit = order.netProfit;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
      {/* Order Header */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }} elevation={2}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order #{order.orderId}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={order.status}
                color={statusColors[order.status] || 'default'}
                sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
              />
              {order.trackingNumber && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="body2" color="primary">
                    Tracking: {
                      order.courierCompany === 'TCS' ? (
                        <Link href={`https://www.tcsexpress.com/track/${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">{order.trackingNumber}</Link>
                      ) : order.courierCompany === 'Leopard' ? (
                        <Link href={`https://www.leopardscourier.com/shipment_tracking?cn_number=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">{order.trackingNumber}</Link>
                      ) : (
                        order.trackingNumber
                      )
                    }
                  </Typography>
                </>
              )}
              {order.courierCompany && (
                <Chip
                  label={order.courierCompany}
                  color={order.courierCompany === 'TCS' ? 'primary' : order.courierCompany === 'Leopard' ? 'warning' : 'default'}
                  sx={{ fontWeight: 'bold', minWidth: 100 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign={{ xs: 'left', sm: 'right' }}>
            <Typography variant="subtitle2" color="text.secondary">Net Profit</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: netProfit < 0 ? 'error.main' : 'success.main' }}>
              {netProfit < 0 ? '-' : ''}Rs {Math.abs(netProfit).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Left: Product List & Payment Summary */}
        <Grid item xs={12} md={7}>
          {/* Product List */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Products</Typography>
            <Divider sx={{ mb: 2 }} />
            {order.item.map((i, idx) => {
              const prod = i.product || {};
              return (
                <Box key={prod._id || idx} sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Avatar
                    variant="rounded"
                    src={prod.image || "/placeholder.png"}
                    sx={{ width: 48, height: 48, mr: 2, mb: { xs: 1, sm: 0 } }}
                  />
                  <Box sx={{ minWidth: 120 }}>
                    <Typography fontWeight="bold">{prod.productname || 'Product'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rs {i.salePrice || i.price} × {i.quantity}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto', fontWeight: 'bold', minWidth: 80 }}>
                    Rs {(i.salePrice || i.price) * i.quantity}
                  </Box>
                </Box>
              );
            })}
          </Paper>

          {/* Payment Summary */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Payment Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>Rs {subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>Rs {order.shippingCharges}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Other Expenses</Typography>
              <Typography>Rs {order.otherExpenses || 0}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography>Total</Typography>
              <Typography>Rs {total}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>Net Profit</Typography>
              <Typography sx={{ color: netProfit < 0 ? 'error.main' : 'success.main', fontWeight: 'bold' }}>
                {netProfit < 0 ? '-' : ''}Rs {Math.abs(netProfit).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right: Customer Info */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 3 }} elevation={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Customer</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography fontWeight="bold">{order.customerName}</Typography>
            {order.phoneNumber && <Typography color="text.secondary">{order.phoneNumber}</Typography>}
            {order.orderCountForCustomer && order.phoneNumber && (
              <Link component={RouterLink} to={`/customer-orders/${order.phoneNumber}`} underline="hover" color="primary">
                {order.orderCountForCustomer} order{order.orderCountForCustomer > 1 ? 's' : ''}
              </Link>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" color="text.secondary">Shipping Address</Typography>
            <Typography>{order.customerAddress}</Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Comments Section */}
      <Box sx={{ mt: 4, maxWidth: 700, mx: 'auto' }}>
        <Paper sx={{ p: 2, borderRadius: 3 }} elevation={1}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Order Comments</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Add a comment"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              onClick={async () => {
                if (commentInput.trim()) {
                  try {
                    const res = await fetch(`${API_URL}/comments`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      credentials: 'include',
                      body: JSON.stringify({ text: commentInput })
                    });
                    const data = await res.json();
                    if (data.data) {
                      setComments(data.data);
                      setCommentInput('');
                      setAlert({ open: true, type: 'success', message: 'Comment added!' });
                      setAlertKey((k) => k + 1);
                    } else if (data.message) {
                      setAlert({ open: true, type: 'error', message: data.message });
                      setAlertKey((k) => k + 1);
                    }
                  } catch (err) {
                    setAlert({ open: true, type: 'error', message: 'Error adding comment.' });
                    setAlertKey((k) => k + 1);
                  }
                }
              }}
              sx={{ minWidth: 100 }}
            >
              Add
            </Button>
          </Box>
          <Box>
            {comments.length === 0 ? (
              <Typography color="text.secondary">No comments yet.</Typography>
            ) : (
              comments.slice().reverse().map((c, idx) => (
                <Box key={idx} sx={{ mb: 1.5, p: 1, borderRadius: 2, bgcolor: '#f7f7fa' }}>
                  <Typography variant="body2">{c.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.date ? new Date(c.date).toLocaleString() : ''}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewOrder;
