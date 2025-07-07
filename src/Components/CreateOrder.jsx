import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CreateOrder = () => {
  const [form, setForm] = useState({
    orderId: '',
    customerName: '',
    phoneNumber: '',
    customerAddress: '',
    shippingCharges: 0,
    trackingNumber: '',
    courierCompany: 'Custom',
  });
  const [selectedProducts, setSelectedProducts] = useState([]); // [{productId, quantity}]
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');

  // const API_URL = "http://localhost:8000/v1/api/product";
  const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product";
  // const ORDER_API_URL = "http://localhost:8000/v1/api/product/orders";
  const ORDER_API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setProductLoading(true);
    setProductError(null);
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.data) {
        setProducts(data.data);
      }
    } catch (err) {
      setProductError('Failed to load products');
      console.log(err);
    }
    setProductLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

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
    try {
      const res = await fetch(ORDER_API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: form.orderId,
          customerName: form.customerName,
          phoneNumber: Number(form.phoneNumber),
          customerAddress: form.customerAddress,
          item: selectedProducts.map(p => {
            const prod = products.find(prod => prod._id === p.productId);
            return {
              product: p.productId,
              quantity: p.quantity,
              price: prod ? prod.price : 0,
              salePrice: prod && prod.salePrice ? prod.salePrice : undefined
            };
          }),
          totalPrice,
          shippingCharges: Number(form.shippingCharges || 0),
          trackingNumber: form.trackingNumber,
          courierCompany: form.courierCompany,
        })
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ orderId: '', customerName: '', phoneNumber: '', customerAddress: '', shippingCharges: 0, trackingNumber: '', courierCompany: 'Custom' });
        setSelectedProducts([]);
      } else {
        alert('Failed to create order');
        const errData = await res.json();
        console.log(errData);
      }
    } catch (err) {
      alert('Error creating order');
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6fc', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📝 Create Order
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Order ID"
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Customer Name"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Customer Address"
            name="customerAddress"
            value={form.customerAddress}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Tracking Number"
            name="trackingNumber"
            value={form.trackingNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
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
          <Paper sx={{ p: 2, my: 2 }}>
            <Typography variant="h6">Select Products</Typography>
            {productLoading && <Typography color="text.secondary">Loading products...</Typography>}
            {productError && <Typography color="error.main">{productError}</Typography>}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Product</InputLabel>
              <Select
                value={selectedProductId}
                label="Select Product"
                onChange={e => {
                  const productId = e.target.value;
                  if (!selectedProducts.find(p => p.productId === productId)) {
                    setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
                  }
                  setSelectedProductId('');
                }}
              >
                {Array.isArray(products) && products.map(product => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.productname} (Rs {product.salePrice || product.price})
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
                    <IconButton onClick={() => handleProductChange(product._id, selected.quantity - 1)} disabled={selected.quantity <= 1} size="small"><RemoveIcon /></IconButton>
                    <TextField
                      type="number"
                      size="small"
                      value={selected.quantity}
                      onChange={e => handleProductChange(product._id, Math.max(1, Number(e.target.value)))}
                      sx={{ width: 70 }}
                      inputProps={{ min: 1 }}
                    />
                    <IconButton onClick={() => handleProductChange(product._id, selected.quantity + 1)} size="small"><AddIcon /></IconButton>
                  </Grid>
                  <Grid item xs={2}>
                    <Button color="error" size="small" onClick={() => handleRemoveProduct(product._id)}>Remove</Button>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
          <TextField
            label="Shipping Charges"
            name="shippingCharges"
            value={form.shippingCharges}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0 }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Total: Rs {totalPrice}</Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </Button>
          {success && <Typography color="success.main" sx={{ mt: 2 }}>Order created successfully!</Typography>}
        </form>
      </Box>
    </Box>
  );
};

export default CreateOrder;
