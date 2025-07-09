import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem, Grid, Paper, IconButton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MIUIAlert from './MIUIAlert';
import { api } from '../server';

const EditOrder = () => {
  const { id } = useParams(); // used for editing
  const [form, setForm] = useState({
    orderId: '',
    customerName: '',
    phoneNumber: '',
    customerAddress: '',
    shippingCharges: 0,
    trackingNumber: '',
    courierCompany: 'Custom',
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const API_URL = `${api}/v1/api/product `;
  const ORDER_API_URL = `${api}/v1/api/product/orders`;

  // const API_URL = "http://localhost:8000/v1/api/product";
  // const ORDER_API_URL = "http://localhost:8000/v1/api/product/orders";
  // const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product";
  // const ORDER_API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";

  useEffect(() => {
    fetchProducts();
    if (id) fetchOrder();
  }, [id]);

  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setProducts(data.data || []);
    } catch (err) {
      console.log(err)
      setProductError('Failed to load products');
      setAlert({ open: true, type: 'error', message: 'Failed to load products.' });
      setAlertKey((k) => k + 1);
    }
    setProductLoading(false);
  };

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${ORDER_API_URL}/${id}`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.data) {
        const order = data.data;
        setForm({
          orderId: order.orderId,
          customerName: order.customerName,
          phoneNumber: order.phoneNumber,
          customerAddress: order.customerAddress,
          shippingCharges: order.shippingCharges || 0,
          trackingNumber: order.trackingNumber || '',
          courierCompany: order.courierCompany || 'Custom',
          otherExpenses: order.otherExpenses || 0,
        });
        const formattedItems = order.item.map(i => ({
          productId: typeof i.product === 'object' ? i.product._id : i.product,
          quantity: i.quantity
        }));
        setSelectedProducts(formattedItems);
      }
    } catch (err) {
      console.log(err)
      setAlert({ open: true, type: 'error', message: 'Failed to load order.' });
      setAlertKey((k) => k + 1);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProductChange = (productId, quantity) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) {
        return prev.map(p => p.productId === productId ? { ...p, quantity } : p);
      } else {
        return [...prev, { productId, quantity }];
      }
    });
  };

  const handleRemoveProduct = (productId) =>
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));

  const getProductPrice = (productId) => {
    const prod = products.find(p => p._id === productId);
    return prod ? (prod.salePrice || prod.price || 0) : 0;
  };

  const totalProductPrice = selectedProducts.reduce((sum, p) => sum + getProductPrice(p.productId) * p.quantity, 0);
  const totalPrice = totalProductPrice + Number(form.shippingCharges || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const orderPayload = {
      orderId: form.orderId,
      customerName: form.customerName,
      phoneNumber: Number(form.phoneNumber),
      customerAddress: form.customerAddress,
      shippingCharges: Number(form.shippingCharges),
      trackingNumber: form.trackingNumber,
      courierCompany: form.courierCompany,
      totalPrice,
      item: selectedProducts.map(p => {
        const prod = products.find(prod => prod._id === p.productId);
        return {
          product: p.productId,
          quantity: p.quantity,
          price: prod?.price || 0,
          salePrice: prod?.salePrice
        };
      }),
      otherExpenses: Number(form.otherExpenses || 0),
    };

    try {
      const res = await fetch(id ? `${ORDER_API_URL}/${id}` : ORDER_API_URL, {
        method: id ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        setSuccess(true);
        setAlert({ open: true, type: 'success', message: 'Order saved successfully!' });
        setAlertKey((k) => k + 1);
        if (!id) {
          setForm({ orderId: '', customerName: '', phoneNumber: '', customerAddress: '', shippingCharges: 0, trackingNumber: '', courierCompany: 'Custom' });
          setSelectedProducts([]);
        }
      } else {
        const errData = await res.json();
        setAlert({ open: true, type: 'error', message: errData.message || 'Failed to save order.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      console.log(err)
      setAlert({ open: true, type: 'error', message: 'Error saving order.' });
      setAlertKey((k) => k + 1);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6fc', minHeight: '100vh' }}>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {id ? '✏️ Edit Order' : '📝 Create Order'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Order ID" name="orderId" value={form.orderId} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Tracking Number" name="trackingNumber" value={form.trackingNumber} onChange={handleChange} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Courier Company</InputLabel>
                <Select
                  name="courierCompany"
                  value={form.courierCompany}
                  label="Courier Company"
                  onChange={handleChange}
                >
                  <MenuItem value="TCS">TCS</MenuItem>
                  <MenuItem value="Leopard">Leopard</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Customer Address" name="customerAddress" value={form.customerAddress} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Other Expenses" name="otherExpenses" value={form.otherExpenses || ''} onChange={handleChange} type="number" /></Grid>
          </Grid>

          <Paper sx={{ p: 2, my: 2 }}>
            <Typography variant="h6">Select Products</Typography>
            {productLoading && <Typography>Loading products...</Typography>}
            {productError && <Typography color="error">{productError}</Typography>}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Product</InputLabel>
              <Select
                value={selectedProductId}
                onChange={e => {
                  const productId = e.target.value;
                  if (!selectedProducts.find(p => p.productId === productId)) {
                    setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
                  }
                  setSelectedProductId('');
                }}
              >
                {products.map(p => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.productname} (Rs {p.salePrice || p.price})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedProducts.map(selected => {
              const product = products.find(p => p._id === selected.productId);
              if (!product) return null;
              return (
                <Grid container alignItems="center" spacing={1} key={selected.productId} sx={{ my: 1 }}>
                  <Grid item xs={4}>{product.productname}</Grid>
                  <Grid item xs={3}>Rs {product.salePrice || product.price}</Grid>
                  <Grid item xs={3}>
                    <IconButton onClick={() => handleProductChange(product._id, selected.quantity - 1)} disabled={selected.quantity <= 1}><RemoveIcon /></IconButton>
                    <TextField
                      type="number"
                      size="small"
                      value={selected.quantity}
                      onChange={e => handleProductChange(product._id, Math.max(1, Number(e.target.value)))}
                      sx={{ width: 60 }}
                    />
                    <IconButton onClick={() => handleProductChange(product._id, selected.quantity + 1)}><AddIcon /></IconButton>
                  </Grid>
                  <Grid item xs={2}>
                    <Button color="error" size="small" onClick={() => handleRemoveProduct(product._id)}>Remove</Button>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>

          <TextField
            fullWidth
            label="Shipping Charges"
            name="shippingCharges"
            type="number"
            value={form.shippingCharges}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>Total: Rs {totalPrice}</Typography>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update Order' : 'Create Order')}
          </Button>

          {success && <Typography color="success.main" sx={{ mt: 2 }}>{id ? 'Order updated' : 'Order created'} successfully!</Typography>}
        </form>
      </Box>
    </Box>
  );
};

export default EditOrder;
