import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, Button, Avatar, Link, Chip
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // const API_URL = `http://localhost:8000/v1/api/product/orders/${id}`;
  const API_URL = `https://crm-backend-rho-weld.vercel.app/v1/api/product/orders/${id}`;

  useEffect(() => {
    fetch(API_URL, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) setOrder(data.data);
      })
      .catch(err => console.error("Error fetching order:", err));
  }, [id]);

  if (!order) return <Typography>Loading order...</Typography>;

  const subtotal = order.item.reduce((sum, i) => sum + (i.salePrice || i.price) * i.quantity, 0);
  const total = subtotal + order.shippingCharges;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        #{order.orderId} - {order.status || 'Unfulfilled'} | Payment Pending
      </Typography>
      {order.trackingNumber && (
        <Typography variant="subtitle1" color="primary" mb={1}>
          Tracking Number: {
            order.courierCompany === 'TCS' ? (
              <Link href={`https://www.tcsexpress.com/track/${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">{order.trackingNumber}</Link>
            ) : order.courierCompany === 'Leopard' ? (
              <Link href={`https://www.leopardscourier.com/shipment_tracking?cn_number=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer">{order.trackingNumber}</Link>
            ) : (
              order.trackingNumber
            )
          }
        </Typography>
      )}
      {order.courierCompany && (
        <Chip
          label={order.courierCompany}
          color={order.courierCompany === 'TCS' ? 'primary' : order.courierCompany === 'Leopard' ? 'warning' : 'default'}
          sx={{ fontWeight: 'bold', minWidth: 100, mb: 2 }}
        />
      )}
      <Typography variant="body2" color="text.secondary" mb={3}>
        {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
      </Typography>

      <Grid container spacing={2}>
        {/* Left side */}
        <Grid item xs={12} md={8}>
          {/* Fulfillment Box */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Unfulfilled ({order.item.length})</Typography>
            {order.item.map((i, idx) => {
              const prod = i.product || {};
              return (
                <Box key={prod._id || idx} sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Avatar
                    variant="rounded"
                    src={prod.image || "/placeholder.png"}
                    sx={{ width: 56, height: 56, mr: 2, mb: { xs: 1, sm: 0 } }}
                  />
                  <Box sx={{ minWidth: 120 }}>
                    <Typography>{prod.productname || 'Product'}</Typography>
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
            <Button variant="contained" size="small">Fulfill item</Button>
          </Paper>

          {/* Payment Summary */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Payment pending</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>Rs {subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>Rs {order.shippingCharges}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography>Total</Typography>
              <Typography>Rs {total}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography>Paid</Typography>
              <Typography>Rs 0.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Balance</Typography>
              <Typography>Rs {total}</Typography>
            </Box>
            <Button variant="outlined" sx={{ mt: 2, mr: 1 }}>Send invoice</Button>
            <Button variant="contained" sx={{ mt: 2 }}>Mark as paid</Button>
          </Paper>

          {/* Timeline */}
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h6">Timeline</Typography>
            <Typography color="text.secondary" variant="body2" mt={1}>
              Only you and other staff can see comments
            </Typography>
          </Paper>
        </Grid>

        {/* Right side */}
        <Grid item xs={12} md={4}>
          {/* Notes */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6">Notes</Typography>
            <Typography color="text.secondary">No notes from customer</Typography>
          </Paper>

          {/* Customer */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6">Customer</Typography>
            <Typography>{order.customerName}</Typography>
            {order.phoneNumber && <Typography color="text.secondary">{order.phoneNumber}</Typography>}
            {order.orderCountForCustomer && order.phoneNumber && (
              <Link component={RouterLink} to={`/customer-orders/${order.phoneNumber}`} underline="hover" color="primary">
                {order.orderCountForCustomer} order{order.orderCountForCustomer > 1 ? 's' : ''}
              </Link>
            )}
          </Paper>

          {/* Address */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6">Shipping address</Typography>
            <Typography>{order.customerAddress}</Typography>
          </Paper>

          {/* Conversion Summary */}
          <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
            <Typography variant="h6">Conversion summary</Typography>
            <Typography color="text.secondary">Order count and session info not available</Typography>
          </Paper>

          {/* Order Risk */}
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h6">Order risk</Typography>
            <Typography color="text.secondary">Analysis not available</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewOrder;
