import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Paper, Grid, Chip, Alert,
  FormControl, InputLabel, Select, MenuItem, Divider, Stack
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { api } from '../server';
import MIUIAlert from '../Components/MIUIAlert';
import LoadingButton from '../Components/LoadingButton';
import MIUILoader from '../Components/MIUILoader';
import { motion } from 'framer-motion';

const FacebookImport = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [parsed, setParsed] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shipping, setShipping] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = useState(0);

  useEffect(() => {
    fetch(`${api}/v1/api/product`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.data) setProducts(d.data); });
  }, []);

  const showAlert = (type, msg) => {
    setAlert({ open: true, type, message: msg });
    setAlertKey(k => k + 1);
  };

  const handleParse = async () => {
    if (!message.trim()) return showAlert('error', 'Paste a Facebook message first.');
    setParsing(true);
    try {
      const res = await fetch(`${api}/v1/api/product/orders/parse-facebook`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setParsed(data.data);
        setSelectedProducts(data.data.matchedProducts || []);
        showAlert('success', 'Message parsed! Review details and create the order.');
      } else {
        showAlert('error', data.message || 'Could not parse message.');
      }
    } catch {
      showAlert('error', 'Failed to parse message.');
    }
    setParsing(false);
  };

  const handleCreateOrder = async () => {
    if (!parsed?.customerName || !parsed?.phoneNumber || !parsed?.customerAddress) {
      return showAlert('error', 'Name, phone, and address are required.');
    }
    if (!selectedProducts.length) {
      return showAlert('error', 'Select at least one product.');
    }
    setLoading(true);
    const orderId = `FB-${Date.now().toString().slice(-8)}`;
    const items = selectedProducts.map(p => ({
      product: p.productId,
      quantity: p.quantity,
      price: p.price,
      salePrice: p.salePrice
    }));
    const totalPrice = items.reduce((s, i) => s + (i.salePrice || i.price) * i.quantity, 0) + Number(shipping || 0);

    try {
      const res = await fetch(`${api}/v1/api/product/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerName: parsed.customerName,
          phoneNumber: parsed.phoneNumber,
          customerAddress: parsed.customerAddress,
          item: items,
          totalPrice,
          shippingCharges: Number(shipping || 0),
          orderSource: 'facebook',
          rawMessage: message
        })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('success', 'Facebook order created!');
        setTimeout(() => navigate('/orders'), 1200);
      } else {
        showAlert('error', data.message || 'Failed to create order.');
      }
    } catch {
      showAlert('error', 'Failed to create order.');
    }
    setLoading(false);
  };

  const addProduct = (productId) => {
    const prod = products.find(p => p._id === productId);
    if (!prod || selectedProducts.find(p => p.productId === productId)) return;
    setSelectedProducts(prev => [...prev, {
      productId: prod._id,
      productName: prod.productname,
      quantity: 1,
      price: prod.price,
      salePrice: prod.salePrice || prod.price
    }]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <MIUIAlert open={alert.open} type={alert.type} message={alert.message}
        onClose={() => setAlert(a => ({ ...a, open: false }))} alertKey={alertKey} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <FacebookIcon sx={{ fontSize: 40, color: '#1877F2' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Facebook Order Import</Typography>
            <Typography variant="body2" color="text.secondary">
              Paste unstructured Facebook inbox messages — name, phone, address, and products are extracted automatically.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Paste Facebook Message</Typography>
              <TextField
                multiline rows={12} fullWidth placeholder={`Example:\nTayyab\n03218157305\nBibi jan road, near PTCL\n2x Blue Shirt`}
                value={message} onChange={e => setMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={1}>
                <LoadingButton variant="contained" color="primary" startIcon={<AutoFixHighIcon />} onClick={handleParse} loading={parsing}>
                  Parse Message
                </LoadingButton>
                <Button variant="outlined" startIcon={<ContentPasteIcon />}
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setMessage(text);
                    } catch { showAlert('error', 'Could not read clipboard.'); }
                  }}>
                  Paste from Clipboard
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Extracted Details</Typography>
              {!parsed ? (
                <Alert severity="info">Paste a message and click Parse to auto-fill customer details.</Alert>
              ) : (
                <>
                  <TextField label="Customer Name" fullWidth margin="normal"
                    value={parsed.customerName || ''} onChange={e => setParsed(p => ({ ...p, customerName: e.target.value }))} />
                  <TextField label="Phone Number" fullWidth margin="normal"
                    value={parsed.phoneNumber || ''} onChange={e => setParsed(p => ({ ...p, phoneNumber: e.target.value }))} />
                  <TextField label="Address" fullWidth margin="normal" multiline rows={2}
                    value={parsed.customerAddress || ''} onChange={e => setParsed(p => ({ ...p, customerAddress: e.target.value }))} />
                  <Chip label={`Confidence: ${parsed.confidence}/3 fields detected`} size="small" sx={{ mt: 1 }} color={parsed.confidence >= 2 ? 'success' : 'warning'} />
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Products</Typography>
                  {selectedProducts.map((p, idx) => (
                    <Stack key={p.productId} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={`${p.productName} × ${p.quantity}`} color="primary" variant="outlined" />
                      <TextField type="number" size="small" sx={{ width: 70 }} value={p.quantity}
                        onChange={e => setSelectedProducts(prev => prev.map((x, i) => i === idx ? { ...x, quantity: Number(e.target.value) } : x))} />
                    </Stack>
                  ))}
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Add Product</InputLabel>
                    <Select label="Add Product" value="" onChange={e => addProduct(e.target.value)}>
                      {products.map(p => (
                        <MenuItem key={p._id} value={p._id}>{p.productname} — PKR {p.salePrice || p.price}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField label="Shipping (PKR)" type="number" fullWidth margin="normal"
                    value={shipping} onChange={e => setShipping(e.target.value)} />
                  <LoadingButton variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                    onClick={handleCreateOrder} loading={loading}>
                    Create Facebook Order
                  </LoadingButton>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default FacebookImport;
