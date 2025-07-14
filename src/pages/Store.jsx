import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Store as StoreIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
} from '@mui/icons-material';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { api } from '../server';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const API_URL = `${api}/v1/api/store`;

const Store = () => {
  const [store, setStore] = useState({
    name: '',
    logo: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    businessHours: '',
    taxId: '',
    currency: 'PKR',
    timezone: 'Asia/Karachi',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const [logoPreview, setLogoPreview] = useState('');
  const theme = useTheme();

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/get-store`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setStore(data.data);
          setLogoPreview(data.data.logo || '');
        }
      } else if (res.status === 404) {
        // Store doesn't exist yet, that's okay
        setStore({
          name: '',
          logo: '',
          location: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          description: '',
          businessHours: '',
          taxId: '',
          currency: 'PKR',
          timezone: 'Asia/Karachi',
        });
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error fetching store data' });
      setAlertKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStore(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setStore(prev => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/update-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(store),
      });

      const data = await res.json();
      
      if (res.ok) {
        setAlert({ open: true, type: 'success', message: 'Store information saved successfully!' });
        setAlertKey((k) => k + 1);
        setEditing(false);
      } else {
        setAlert({ open: true, type: 'error', message: data.message || 'Error saving store information' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error saving store information' });
      setAlertKey((k) => k + 1);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchStoreData();
    setEditing(false);
  };

  if (loading) {
    return <MIUILoader message="Loading store information..." />;
  }

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
        mode={theme.palette.mode}
      />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          ml: { xs: 0, md: '80px' },
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">
              🏪 Store Management
            </Typography>
            <Button
              variant={editing ? "outlined" : "contained"}
              startIcon={editing ? <CancelIcon /> : <EditIcon />}
              onClick={editing ? handleCancel : () => setEditing(true)}
              disabled={saving}
            >
              {editing ? 'Cancel' : 'Edit Store'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Store Logo and Basic Info */}
            <Grid item width={'100%'}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 3 }}>
                  <Avatar
                    src={logoPreview}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      fontSize: 48,
                      bgcolor: 'primary.main',
                      border: '3px solid #4f8cff'
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 48 }} />
                  </Avatar>
                  {editing && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ mt: 2 }}
                      startIcon={<AddIcon />}
                    >
                      Upload Logo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </Button>
                  )}
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {store.name || 'Store Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {store.description || 'Store description will appear here'}
                </Typography>
              </Paper>
            </Grid>

            {/* Store Details Form */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Store Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Store Name"
                      value={store.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editing}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tax ID"
                      value={store.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Store Description"
                      value={store.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!editing}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={store.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Hours"
                      value={store.businessHours}
                      onChange={(e) => handleInputChange('businessHours', e.target.value)}
                      disabled={!editing}
                      placeholder="e.g., Mon-Fri 9AM-6PM"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Address"
                      value={store.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editing}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Contact Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={store.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={store.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editing}
                      type="email"
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      value={store.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      disabled={!editing}
                      InputProps={{
                        startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Business Settings
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Currency"
                      value={store.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      disabled={!editing}
                      select
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="PKR">PKR (Pakistani Rupee)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Timezone"
                      value={store.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      disabled={!editing}
                      select
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="Asia/Karachi">Asia/Karachi (Pakistan)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </TextField>
                  </Grid>
                </Grid>

                {editing && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={<SaveIcon />}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Store; 