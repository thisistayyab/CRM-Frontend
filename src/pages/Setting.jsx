import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, CardHeader, Divider, TextField,
  Button, Grid, Avatar, Alert, CircularProgress
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import { api } from '../server';
import MIUIAlert from '../Components/MIUIAlert';

const Setting = () => {
  const [user, setUser] = useState({ fullname: '', email: '', phone: '', address: '' });
  const [store, setStore] = useState({ name: '', address: '', phone: '', email: '', currency: 'PKR' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({ profile: false, store: false, password: false });
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, storeRes] = await Promise.all([
          fetch(`${api}/v1/api/user/get-user`, { credentials: 'include' }),
          fetch(`${api}/v1/api/store/get-store`, { credentials: 'include' })
        ]);
        const userData = await userRes.json();
        const storeData = await storeRes.json();
        if (userData.data) setUser({
          fullname: userData.data.fullname || '',
          email: userData.data.email || '',
          phone: userData.data.phone || '',
          address: userData.data.address || ''
        });
        if (storeData.data) setStore({
          name: storeData.data.name || '',
          address: storeData.data.address || '',
          phone: storeData.data.phone || '',
          email: storeData.data.email || '',
          currency: storeData.data.currency || 'PKR'
        });
      } catch {
        setAlert({ open: true, type: 'error', message: 'Failed to load settings.' });
        setAlertKey(k => k + 1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
    setAlertKey(k => k + 1);
  };

  const handleUpdateProfile = async () => {
    setSaving(s => ({ ...s, profile: true }));
    try {
      const res = await fetch(`${api}/v1/api/user/update-account`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: user.fullname, email: user.email, phone: user.phone, address: user.address })
      });
      const data = await res.json();
      if (res.ok) showAlert('success', 'Profile updated successfully.');
      else showAlert('error', data.message || 'Failed to update profile.');
    } catch {
      showAlert('error', 'Failed to update profile.');
    } finally {
      setSaving(s => ({ ...s, profile: false }));
    }
  };

  const handleUpdateStore = async () => {
    setSaving(s => ({ ...s, store: true }));
    try {
      const res = await fetch(`${api}/v1/api/store/update-store`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store)
      });
      const data = await res.json();
      if (res.ok) showAlert('success', 'Store settings updated successfully.');
      else showAlert('error', data.message || 'Failed to update store.');
    } catch {
      showAlert('error', 'Failed to update store.');
    } finally {
      setSaving(s => ({ ...s, store: false }));
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showAlert('error', 'New passwords do not match.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      showAlert('error', 'Password must be at least 6 characters.');
      return;
    }
    setSaving(s => ({ ...s, password: true }));
    try {
      const res = await fetch(`${api}/v1/api/user/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('success', 'Password changed successfully.');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showAlert('error', data.message || 'Failed to change password.');
      }
    } catch {
      showAlert('error', 'Failed to change password.');
    } finally {
      setSaving(s => ({ ...s, password: false }));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <MIUIAlert open={alert.open} type={alert.type} message={alert.message}
        onClose={() => setAlert(a => ({ ...a, open: false }))} alertKey={alertKey} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">Settings</Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
              title={<Typography variant="h6" fontWeight="bold">Profile Settings</Typography>}
              action={
                <Button component={Link} to="/profile-edit" size="small" variant="outlined">
                  Edit Photo
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TextField label="Full Name" value={user.fullname}
                onChange={e => setUser(u => ({ ...u, fullname: e.target.value }))}
                fullWidth margin="normal" />
              <TextField label="Email" value={user.email}
                onChange={e => setUser(u => ({ ...u, email: e.target.value }))}
                fullWidth margin="normal" />
              <TextField label="Phone" value={user.phone}
                onChange={e => setUser(u => ({ ...u, phone: e.target.value }))}
                fullWidth margin="normal" />
              <TextField label="Address" value={user.address}
                onChange={e => setUser(u => ({ ...u, address: e.target.value }))}
                fullWidth margin="normal" multiline rows={2} />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}
                onClick={handleUpdateProfile} disabled={saving.profile}>
                {saving.profile ? 'Saving...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><StoreIcon /></Avatar>}
              title={<Typography variant="h6" fontWeight="bold">Store Settings</Typography>}
              action={
                <Button component={Link} to="/store" size="small" variant="outlined">
                  Full Store
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TextField label="Store Name" value={store.name}
                onChange={e => setStore(s => ({ ...s, name: e.target.value }))}
                fullWidth margin="normal" />
              <TextField label="Store Address" value={store.address}
                onChange={e => setStore(s => ({ ...s, address: e.target.value }))}
                fullWidth margin="normal" multiline rows={2} />
              <TextField label="Store Phone" value={store.phone}
                onChange={e => setStore(s => ({ ...s, phone: e.target.value }))}
                fullWidth margin="normal" />
              <TextField label="Store Email" value={store.email}
                onChange={e => setStore(s => ({ ...s, email: e.target.value }))}
                fullWidth margin="normal" />
              <Button variant="contained" color="secondary" sx={{ mt: 2 }}
                onClick={handleUpdateStore} disabled={saving.store}>
                {saving.store ? 'Saving...' : 'Update Store'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><LockIcon /></Avatar>}
              title={<Typography variant="h6" fontWeight="bold">Change Password</Typography>}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField label="Current Password" type="password" fullWidth
                    value={passwords.oldPassword}
                    onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="New Password" type="password" fullWidth
                    value={passwords.newPassword}
                    onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Confirm New Password" type="password" fullWidth
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} />
                </Grid>
              </Grid>
              <Button variant="contained" color="warning" sx={{ mt: 2 }}
                onClick={handleChangePassword} disabled={saving.password}>
                {saving.password ? 'Changing...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            Need help? Contact us at{' '}
            <a href="mailto:taylance@gmail.com" style={{ color: 'inherit' }}>taylance@gmail.com</a>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Setting;
