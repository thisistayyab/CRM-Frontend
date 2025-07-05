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

// const API_URL = "http://localhost:8000/v1/api/user"
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user"

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
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
          throw new Error('Failed to fetch user');
        }
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        setError(err.message || 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading user...</Box>;
  }

  if (error) {
    return <Box sx={{ p: 4, textAlign: 'center', color: 'red' }}>{error}</Box>;
  }

  if (!user) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>No user data found.</Box>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: '#e4e9f7',
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
  );
};

export default User;
