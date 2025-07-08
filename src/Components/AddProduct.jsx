import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MIUIAlert from './MIUIAlert';

// const API_URL = "http://localhost:8000/v1/api/product";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product";

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [salePrice, setSalePrice] = useState('');
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate required fields
    if (!name || !price || !inventory || !category || !description) {
      setAlert({ open: true, type: 'warning', message: 'All required fields must be filled.' });
      setAlertKey((k) => k + 1);
      setLoading(false);
      return;
    }
    if (!image) {
      setAlert({ open: true, type: 'warning', message: 'Product image is required.' });
      setAlertKey((k) => k + 1);
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('productname', name);
    formData.append('price', price);
    formData.append('quantity', inventory);
    formData.append('description', description);
    formData.append('category', category);
    if (salePrice) formData.append('salePrice', salePrice);
    formData.append('image', image);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setAlert({ open: true, type: 'success', message: 'Product added successfully!' });
        setAlertKey((k) => k + 1);
        setTimeout(() => navigate('/products'), 1000);
      } else if (data.message && data.message.toLowerCase().includes('image')) {
        setAlert({ open: true, type: 'warning', message: 'Product image is required.' });
        setAlertKey((k) => k + 1);
      } else if (data.message && data.message.toLowerCase().includes('required')) {
        setAlert({ open: true, type: 'warning', message: 'All required fields must be filled.' });
        setAlertKey((k) => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: 'Error processing your request.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error processing your request.' });
      setAlertKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: '20px' }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Add Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Inventory"
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Sale Price"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Product Image</InputLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: '8px' }}
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ px: 5, py: 1.5, borderRadius: '30px', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;
