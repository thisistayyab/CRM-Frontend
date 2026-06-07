import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MIUIAlert from './MIUIAlert';
import LoadingButton from './LoadingButton';
import MIUILoader from './MIUILoader';
import { api } from '../server';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const API_URL = `${api}/v1/api/product`;

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

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const fieldSx = {
    borderRadius: 2,
    background: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafd',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
    fontSize: 16,
    color: theme.palette.text.primary
  };
  return (
    <>
    <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
      {/* Header Row */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 0.5 }}>Add New Product</Typography>
        </Grid>
      </Grid>
      <form id="add-product-form" onSubmit={handleSubmit} autoComplete="off">
        <Grid container spacing={2} alignItems="flex-start">
          {/* Left Column: Main Info */}
          <Grid item sx={{ width: { xs: '100%', md: '69%' } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 2, background: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: 6 }}>
              {/* First row: General Information (Product Name) */}
              <Typography variant="h6" fontWeight={700} mb={1.5}>General Information</Typography>
              <TextField
                fullWidth
                label="Name Product"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                InputProps={{ sx: fieldSx }}
                sx={{ mb: 2 }}
              />
              {/* Second row: Description */}
              <TextField
                fullWidth
                label="Description Product"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                multiline
                minRows={3}
                InputProps={{ sx: fieldSx }}
                sx={{ mb: 2 }}
              />
              {/* Last row: Pricing and Stock */}
              <Typography variant="h6" fontWeight={700} mb={1.5}>Pricing And Stock</Typography>
              <Grid container spacing={1.5} alignItems="flex-start">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Base Pricing"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    InputProps={{ sx: fieldSx }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={inventory}
                    onChange={e => setInventory(e.target.value)}
                    required
                    InputProps={{ sx: fieldSx }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Sale Price (optional)"
                    type="number"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    InputProps={{ sx: fieldSx }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Right Column: Image & Category (right on md+, below on sm/xs) */}
          <Grid item sx={{ width: { xs: '100%', md: '29%' } }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, mb: 2, background: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: 6 }}>
              <Typography variant="h6" fontWeight={700} mb={1.5}>Upload Img</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {image ? (
                  <Box component="img" src={URL.createObjectURL(image)} alt="Product Preview" sx={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 1 }} />
                ) : (
                  <Box sx={{ width: 180, height: 180, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafd', borderRadius: 3, border: '1px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.text.secondary, mb: 1, fontSize: 18 }}>
                    No Image
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: 99, fontWeight: 500, color: isDark ? '#6DD400' : '#007AFF', borderColor: isDark ? '#6DD400' : '#007AFF', px: 3, py: 1, '&:hover': { bgcolor: isDark ? 'rgba(109,212,0,0.08)' : '#eaf4ff', borderColor: isDark ? '#6DD400' : '#007AFF' } }}
                >
                  Upload Image
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </Button>
              </Box>
            </Paper>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 4, background: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: 6 }}>
              <Typography variant="h6" fontWeight={700} mb={1.5}>Category</Typography>
              <TextField
                fullWidth
                label="Product Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                InputProps={{ sx: fieldSx }}
              />
            </Paper>
          </Grid>
        </Grid>
      </form>
      {/* Add Product Button at the end of the container */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, mb: 2 }}>
        <LoadingButton type="submit" form="add-product-form" variant="contained" color="success" size="large"
          loading={loading}
          sx={{
            borderRadius: 99,
            fontWeight: 600,
            px: 3,
            py: 1,
            fontSize: 18,
            letterSpacing: 0.5,
          }}
        >
          Add Product
        </LoadingButton>
      </Box>
      </motion.div>
      {loading && <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'action.disabledBackground', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIUILoader message="Adding product..." /></Box>}
    </Container>
    </>
  );
};

export default AddProduct;
