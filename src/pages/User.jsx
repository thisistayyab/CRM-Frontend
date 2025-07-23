import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { api } from '../server';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const API_URL = `${api}/v1/api/user`

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // setError(null);
      try {
        const res = await fetch(`${API_URL}/get-user`, {
          method: 'GET',
          credentials: 'include', // Send cookies
        });
        if (res.status === 401 || res.status === 403) {
          // Unauthorized or token expired
          navigate('/login-signup');
          return;
        }
        if (!res.ok) {
          const data = await res.json();
          setAlert({ open: true, type: 'error', message: data.message || 'Failed to fetch user' });
          setAlertKey((k) => k + 1);
          return;
        }
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        setAlert({ open: true, type: 'error', message: err.message || 'Error fetching user' });
        setAlertKey((k) => k + 1);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <MIUILoader message="Loading user..." />;
  }

  if (!user) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>No user data found.</Box>;
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
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            minHeight: '100vh',
            ml: { xs: 0, md: '80px' }, // Sidebar adjustment
          }}
        >
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              👤 User Profile
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
              {/* Profile Section */}
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Avatar
                  sx={{ width: 80, height: 80, fontSize: 32, bgcolor: 'primary.main' }}
                  src={user.profilepic || ''}
                >
                  {user.fullname ? user.fullname.charAt(0) : '?'}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">{user.fullname || user.name || 'No Name'}</Typography>
                  <Typography variant="body1" color="text.secondary">{user.email}</Typography>
                  <Typography variant="body2" color="primary.main">{user.role || 'User'}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Account Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{user.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{user.address || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Actions */}
              <Box display="flex" gap={2}>
                <Link to='/profile-edit'>
                  <Button variant="contained" color="primary">Edit Profile</Button>
                </Link>
                <Button variant="outlined" color="error">Deactivate</Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </motion.div>
    </>
  );
};

export default User;
