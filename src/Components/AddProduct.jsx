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

const API_URL = "http://localhost:8000/v1/api/product";

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('productname', name);
    formData.append('price', price);
    formData.append('quantity', inventory);
    formData.append('description', description);
    formData.append('category', category);
    if (salePrice) formData.append('salePrice', salePrice);
    if (image) formData.append('image', image);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        navigate('/products');
      } else {
        alert('Failed to add product');
      }
    } catch (err) {
      console.log(err)
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
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
