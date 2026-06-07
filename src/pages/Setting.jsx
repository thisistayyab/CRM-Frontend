import React, { useEffect, useState } from 'react';

import {

  Box, Typography, Card, CardContent, CardHeader, TextField,

  Button, Grid, Avatar, Alert, CircularProgress, useTheme, alpha,

} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

import StoreIcon from '@mui/icons-material/Store';

import PersonIcon from '@mui/icons-material/Person';

import LockIcon from '@mui/icons-material/Lock';

import { Link } from 'react-router-dom';

import { api } from '../server';

import { SUPPORT_EMAIL, COMPANY_URL, COMPANY_NAME } from '../constants/brand';

import {

  getSurfaceCardSx,

  getCardHeaderSx,

  getCardContentSx,

  getFormFieldSx,

} from '../utils/pageStyles';

import MIUIAlert from '../Components/MIUIAlert';

import LoadingButton from '../Components/LoadingButton';



const fieldProps = {

  fullWidth: true,

  size: 'small',

  sx: getFormFieldSx(),

};



const Setting = () => {

  const theme = useTheme();

  const cardSx = getSurfaceCardSx(theme);

  const isDark = theme.palette.mode === 'dark';



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



  const avatarSx = (color) => ({

    bgcolor: alpha(theme.palette[color].main, isDark ? 0.22 : 0.12),

    color: `${color}.main`,

    width: 40,

    height: 40,

  });



  if (loading) {

    return (

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>

        <CircularProgress color="primary" />

      </Box>

    );

  }



  return (

    <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, sm: 3, md: 4 } }}>

      <MIUIAlert open={alert.open} type={alert.type} message={alert.message}

        onClose={() => setAlert(a => ({ ...a, open: false }))} alertKey={alertKey} />



      <Box sx={{ mb: { xs: 3, md: 4 } }}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>

          <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />

          <Typography variant="h4" fontWeight={700} color="text.primary">

            Settings

          </Typography>

        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ pl: 5.5 }}>

          Manage your profile, store details, and account security.

        </Typography>

      </Box>



      <Grid container spacing={{ xs: 2.5, md: 3 }}>

        <Grid item xs={12} md={6}>

          <Card sx={cardSx}>

            <CardHeader

              sx={getCardHeaderSx()}

              avatar={<Avatar sx={avatarSx('primary')}><PersonIcon fontSize="small" /></Avatar>}

              title={<Typography variant="subtitle1" fontWeight={700}>Profile Settings</Typography>}

              action={

                <Button component={Link} to="/profile-edit" size="small" variant="outlined" color="primary">

                  Edit Photo

                </Button>

              }

            />

            <CardContent sx={getCardContentSx()}>

              <Grid container spacing={2}>

                <Grid item xs={12}>

                  <TextField label="Full Name" value={user.fullname}

                    onChange={e => setUser(u => ({ ...u, fullname: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12}>

                  <TextField label="Email" value={user.email}

                    onChange={e => setUser(u => ({ ...u, email: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12}>

                  <TextField label="Phone" value={user.phone}

                    onChange={e => setUser(u => ({ ...u, phone: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12}>

                  <TextField label="Address" value={user.address}

                    onChange={e => setUser(u => ({ ...u, address: e.target.value }))}

                    {...fieldProps} multiline rows={2} />

                </Grid>

              </Grid>

              <LoadingButton variant="contained" color="primary" sx={{ mt: 2.5 }}

                onClick={handleUpdateProfile} loading={saving.profile}>

                Update Profile

              </LoadingButton>

            </CardContent>

          </Card>

        </Grid>



        <Grid item xs={12} md={6}>

          <Card sx={cardSx}>

            <CardHeader

              sx={getCardHeaderSx()}

              avatar={<Avatar sx={avatarSx('info')}><StoreIcon fontSize="small" /></Avatar>}

              title={<Typography variant="subtitle1" fontWeight={700}>Store Settings</Typography>}

              action={

                <Button component={Link} to="/store" size="small" variant="outlined" color="primary">

                  Full Store

                </Button>

              }

            />

            <CardContent sx={getCardContentSx()}>

              <Grid container spacing={2}>

                <Grid item xs={12}>

                  <TextField label="Store Name" value={store.name}

                    onChange={e => setStore(s => ({ ...s, name: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12}>

                  <TextField label="Store Address" value={store.address}

                    onChange={e => setStore(s => ({ ...s, address: e.target.value }))}

                    {...fieldProps} multiline rows={2} />

                </Grid>

                <Grid item xs={12} sm={6}>

                  <TextField label="Store Phone" value={store.phone}

                    onChange={e => setStore(s => ({ ...s, phone: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12} sm={6}>

                  <TextField label="Store Email" value={store.email}

                    onChange={e => setStore(s => ({ ...s, email: e.target.value }))}

                    {...fieldProps} />

                </Grid>

              </Grid>

              <LoadingButton variant="contained" color="secondary" sx={{ mt: 2.5 }}

                onClick={handleUpdateStore} loading={saving.store}>

                Update Store

              </LoadingButton>

            </CardContent>

          </Card>

        </Grid>



        <Grid item xs={12}>

          <Card sx={cardSx}>

            <CardHeader

              sx={getCardHeaderSx()}

              avatar={<Avatar sx={avatarSx('warning')}><LockIcon fontSize="small" /></Avatar>}

              title={<Typography variant="subtitle1" fontWeight={700}>Change Password</Typography>}

              subheader={

                <Typography variant="caption" color="text.secondary">

                  Use at least 6 characters for your new password.

                </Typography>

              }

            />

            <CardContent sx={getCardContentSx()}>

              <Grid container spacing={2}>

                <Grid item xs={12} md={4}>

                  <TextField label="Current Password" type="password"

                    value={passwords.oldPassword}

                    onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12} md={4}>

                  <TextField label="New Password" type="password"

                    value={passwords.newPassword}

                    onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}

                    {...fieldProps} />

                </Grid>

                <Grid item xs={12} md={4}>

                  <TextField label="Confirm New Password" type="password"

                    value={passwords.confirmPassword}

                    onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}

                    {...fieldProps} />

                </Grid>

              </Grid>

              <LoadingButton variant="contained" color="warning" sx={{ mt: 2.5 }}

                onClick={handleChangePassword} loading={saving.password}>

                Change Password

              </LoadingButton>

            </CardContent>

          </Card>

        </Grid>



        <Grid item xs={12}>

          <Alert

            severity="info"

            sx={{

              borderRadius: 2,

              border: `1px solid ${alpha(theme.palette.info.main, isDark ? 0.35 : 0.25)}`,

              bgcolor: isDark ? alpha(theme.palette.info.main, 0.08) : alpha(theme.palette.info.main, 0.06),

              color: 'text.primary',

              '& .MuiAlert-icon': { color: 'info.main' },

              '& a': {

                color: 'primary.main',

                fontWeight: 600,

                textDecoration: 'none',

                '&:hover': { textDecoration: 'underline' },

              },

            }}

          >

            Need help? Contact {COMPANY_NAME} at{' '}

            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>

            {' '}or visit{' '}

            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">

              {COMPANY_URL.replace('https://', '')}

            </a>

          </Alert>

        </Grid>

      </Grid>

    </Box>

  );

};



export default Setting;

