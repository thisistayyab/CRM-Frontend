import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardHeader, Divider, Switch, TextField, Button, Grid, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';

const Setting = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState('user@email.com');
  const [storeName, setStoreName] = useState('My Store');

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SettingsIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" fontWeight="bold">Settings</Typography>
      </Box>
      <Grid container spacing={4}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
              title={<Typography variant="h6" fontWeight="bold">Profile Settings</Typography>}
            />
            <Divider />
            <CardContent>
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Full Name"
                value={"John Doe"}
                fullWidth
                margin="normal"
                disabled
              />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Update Profile</Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Store Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><StoreIcon /></Avatar>}
              title={<Typography variant="h6" fontWeight="bold">Store Settings</Typography>}
            />
            <Divider />
            <CardContent>
              <TextField
                label="Store Name"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Store Address"
                value={"123 Main St, City"}
                fullWidth
                margin="normal"
                disabled
              />
              <Button variant="contained" color="secondary" sx={{ mt: 2 }}>Update Store</Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Preferences */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              title={<Typography variant="h6" fontWeight="bold">Preferences</Typography>}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Dark Mode</Typography>
                <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="primary" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Notifications</Typography>
                <Switch checked color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Setting;
