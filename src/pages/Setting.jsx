import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Grid,
  Divider,
  Button,
} from '@mui/material';

const Setting = () => {
  const user = {
    name: 'Tayyab Aslam',
    email: 'thisistayyab@outlook.com',
    role: 'Administrator',
    phone: '+92 300 1234567',
    address: 'Lahore, Punjab, Pakistan',
    avatar: '', // Replace with image URL or leave blank for initials
  };

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
              src={user.avatar}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
              <Typography variant="body1" color="text.secondary">{user.email}</Typography>
              <Typography variant="body2" color="primary.main">{user.role}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Account Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
              <Typography variant="body1">{user.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Address</Typography>
              <Typography variant="body1">{user.address}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Box display="flex" gap={2}>
            <Button variant="contained" color="primary">Edit Profile</Button>
            <Button variant="outlined" color="error">Deactivate</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Setting;
