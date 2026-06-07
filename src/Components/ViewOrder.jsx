import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Grid, Typography, Paper, Divider, Avatar, Link, Chip
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import LoadingButton from './LoadingButton';
import MIUIAlert from './MIUIAlert';
import MIUILoader from './MIUILoader';
import { api } from '../server';
import { PRODUCT_NAME } from '../constants/brand';
import { useTheme } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';

const statusColors = {
  active: 'success',
  canceled: 'error',
  returned: 'warning',
  complete: 'primary',
};

const ViewOrder = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [store, setStore] = useState({ name: '' });
  const [storeLoading, setStoreLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const printRef = useRef();
  
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const API_URL = `${api}/v1/api/product/orders/${id}`;

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

  // Fetch store information
  useEffect(() => {
    const fetchStore = async () => {
      setStoreLoading(true);
      try {
        const res = await fetch(`${api}/v1/api/store/get-store`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setStore(data.data);
          } else {
            // Store not found or other error, keep default
          }
        } else if (res.status === 404) {
          // Store doesn't exist yet, keep default name
        } else {
          // Other HTTP errors, keep default
        }
      } catch (err) {
        // Network errors, keep default store name
      }
      setStoreLoading(false);
    };
    fetchStore();
  }, []);

  if (!order || storeLoading) return <MIUILoader message="Loading order and store info..." />;

  const subtotal = order.item.reduce((sum, i) => sum + (i.salePrice || i.price) * i.quantity, 0);
  const total = subtotal + order.shippingCharges;
  const netProfit = order.netProfit;

  const handlePrintBill = () => {
    const printWindow = window.open('', '_blank');
    const billHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - Order #${order.orderId}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none !important; }
              .bill-header { display: flex; align-items: center; justify-content: flex-start; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
              .bill-logo { flex: 0 0 auto; margin-right: 24px; }
              .bill-logo img { max-width: 90px; max-height: 90px; border-radius: 8px; }
              .bill-info-block { flex: 1 1 auto; text-align: left; }
              .bill-title { font-size: 24px; font-weight: bold; margin-bottom: 6px; }
              .bill-subtitle { font-size: 16px; color: #666; margin-bottom: 10px; }
              .store-contact { font-size: 14px; color: #333; margin-bottom: 0; }
              .bill-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .customer-info, .order-info { flex: 1; }
              .customer-info h3, .order-info h3 { margin-bottom: 10px; font-size: 18px; }
              .products-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .products-table th, .products-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .products-table th { background-color: #f5f5f5; font-weight: bold; }
              .summary { margin-top: 30px; }
              .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .summary-total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
              .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; }
            }
            @media screen {
              body { font-family: Arial, sans-serif; padding: 20px; }
              .bill-header { display: flex; align-items: center; justify-content: flex-start; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
              .bill-logo { flex: 0 0 auto; margin-right: 24px; }
              .bill-logo img { max-width: 90px; max-height: 90px; border-radius: 8px; }
              .bill-info-block { flex: 1 1 auto; text-align: left; }
              .bill-title { font-size: 24px; font-weight: bold; margin-bottom: 6px; }
              .bill-subtitle { font-size: 16px; color: #666; margin-bottom: 10px; }
              .store-contact { font-size: 14px; color: #333; margin-bottom: 0; }
            }
          </style>
        </head>
        <body>
          <div class="bill-header">
            <div class="bill-logo">
              ${store?.logo ? `<img id="storeLogo" src="${store.logo}" alt="Store Logo" />` : ''}
            </div>
            <div class="bill-info-block">
              <div class="bill-title">${store?.name || PRODUCT_NAME}</div>
              <div class="store-contact">
                ${store?.address ? `<div><strong>Address:</strong> ${store.address}</div>` : ''}
                ${store?.phone ? `<div><strong>Phone:</strong> ${store.phone}</div>` : ''}
                ${store?.email ? `<div><strong>Email:</strong> ${store.email}</div>` : ''}
              </div>
            </div>
          </div>
          <div class="bill-info">
            <div class="customer-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${order.customerName}</p>
              <p><strong>Phone:</strong> ${order.phoneNumber || 'N/A'}</p>
              <p><strong>Address:</strong> ${order.customerAddress}</p>
            </div>
            <div class="order-info">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.item.map((i, idx) => {
                const prod = i.product || {};
                return `
                  <tr>
                    <td>${prod.productname || 'Product'}</td>
                    <td>Rs ${i.salePrice || i.price}</td>
                    <td>${i.quantity}</td>
                    <td>Rs ${(i.salePrice || i.price) * i.quantity}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>Rs ${subtotal}</span>
            </div>
            <div class="summary-row">
              <span>Shipping Charges:</span>
              <span>Rs ${order.shippingCharges}</span>
            </div>
            <div class="summary-row summary-total">
              <span>Total Amount:</span>
              <span>Rs ${total}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for shopping!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(billHtml);
    printWindow.document.close();

    // Wait for logo to load before printing
    if (store?.logo) {
      const tryPrint = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
      const img = printWindow.document.getElementById('storeLogo');
      if (img) {
        img.onload = tryPrint;
        img.onerror = tryPrint;
      } else {
        tryPrint();
      }
    } else {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <Box ref={printRef} sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <LoadingButton
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={handlePrintBill}
                loading={storeLoading}
                sx={{ fontWeight: 600, px: 3, py: 1, borderRadius: 2 }}
              >
                Print Bill
              </LoadingButton>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" color="text.secondary">Net Profit</Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ color: netProfit < 0 ? 'error.main' : 'success.main' }}>
                  {netProfit < 0 ? '-' : ''}Rs {Math.abs(netProfit).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container gap={'2%'} rowGap={4} flexWrap="wrap">
        {/* Left: Product List & Payment Summary */}
        <Grid item sx={{ width: { xs: '100%', md: '59%' } }}>
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
        <Grid item sx={{ width: { xs: '100%', md: '39%' } }}>
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
            <LoadingButton
              variant="contained"
              color="primary"
              loading={commentLoading}
              onClick={async () => {
                if (!commentInput.trim()) return;
                setCommentLoading(true);
                try {
                  const res = await fetch(`${API_URL}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                } catch {
                  setAlert({ open: true, type: 'error', message: 'Error adding comment.' });
                  setAlertKey((k) => k + 1);
                } finally {
                  setCommentLoading(false);
                }
              }}
              sx={{ minWidth: 100 }}
            >
              Add
            </LoadingButton>
          </Box>
          <Box>
            {comments.length === 0 ? (
              <Typography color="text.secondary">No comments yet.</Typography>
            ) : (
              comments.slice().reverse().map((c, idx) => (
                <Box key={idx} sx={{
                  mb: 1.5, p: 1, borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#f7f7fa'
                }}>
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
