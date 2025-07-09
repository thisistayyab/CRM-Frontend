import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import avatar from '../assets/images/users/avatar.jpg';
import { api } from '../server';

const API_URL = `${api}/v1/api/user`;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(avatar);
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const res = await fetch(`${API_URL}/get-user`, {
          method: 'GET',
          credentials: 'include',
        });
        const result = await res.json();
        const profileUrl = result.data?.profilepic;
        const name = result.data?.fullname;
        if (profileUrl) {
          setProfilePic(profileUrl);
        }
        if (name) {
          setFullname(name);
        }
      } catch (err) {
        console.error('Error fetching profile pic:', err.message);
      }
    };
    fetchProfilePic();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${api}/v1/api/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log(error);
    }
    handleMenuClose();
    navigate('/login-signup');
  };

  return (
    <AppBar position="static" color="default" elevation={2} sx={{ background: '#181c2a', color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto', position: 'relative' }}>
        {/* Left: Empty for spacing */}
        <Box sx={{ flex: 1 }} />
        {/* Center: Logo and Brand Name */}
        <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', textDecoration: 'none' }} component={RouterLink} to="/">
          <Box component="img" src={logo} alt="Taylance CRM Logo" sx={{ width: 40, height: 40, borderRadius: 2, mr: 1, background: '#232946', p: 0.5, boxShadow: 1 }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontFamily: 'Urbanist, sans-serif', fontSize: 26 }}>
            Taylance CRM
          </Typography>
        </Box>
        {/* Right: User Name and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', display: { xs: 'none', sm: 'block' }, fontFamily: 'Urbanist, sans-serif' }}>
            {fullname}
          </Typography>
          <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
            <Avatar src={profilePic} alt={fullname || 'User'} sx={{ width: 40, height: 40, border: '2px solid #4f8cff', bgcolor: '#fff' }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2, bgcolor: '#232946', color: '#fff', boxShadow: 6 } }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #4f8cff', textAlign: 'center' }}>
              <Avatar src={profilePic} alt={fullname || 'User'} sx={{ width: 48, height: 48, mx: 'auto', mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>{fullname}</Typography>
            </Box>
            <MenuItem component={RouterLink} to="/user" onClick={handleMenuClose} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Profile</MenuItem>
            <MenuItem component={RouterLink} to="/settings" onClick={handleMenuClose} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Settings</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
