import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import {Box, Button} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import avatar from '../assets/images/users/avatar.jpg';
import { api } from '../server';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useColorScheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LaptopIcon from '@mui/icons-material/Laptop';
import ColorModeSelect from '../themes/ColorModeSelect';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleIcon from '@mui/icons-material/People';

const API_URL = `${api}/v1/api/user`;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profilePic, setProfilePic] = useState(avatar);
  const [fullname, setFullname] = useState('');
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const [drawerSearch, setDrawerSearch] = useState("");
  const { mode, setMode } = useColorScheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Add handler for search
  const handleDrawerSearch = (e) => {
    if (e.key === 'Enter' && drawerSearch.trim()) {
      handleDrawerSearchNavigate();
      setDrawerOpen(false);
    }
  };
  const handleDrawerSearchIcon = () => {
    if (drawerSearch.trim()) {
      handleDrawerSearchNavigate();
      setDrawerOpen(false);
    }
  };
  const handleDrawerSearchNavigate = () => {
    const q = drawerSearch.trim();
    if (location.pathname.startsWith('/products') || isLikelyProductName(q)) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/orders?search=${encodeURIComponent(q)}`);
    }
  };
  function isLikelyProductName(q) {
    return /[a-zA-Z]/.test(q);
  }

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 40) {
        setShowMobileNavbar(false); // Scrolling down
      } else {
        setShowMobileNavbar(true); // Scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    navigate('/login');
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Store', icon: <StoreIcon />, path: '/store' },
    { text: 'Products', icon: <ShoppingBagIcon />, path: '/products' },
    { text: 'Inventory', icon: <Inventory2OutlinedIcon />, path: '/inventory' },
    { text: 'Analytics', icon: <PieChartIcon />, path: '/analytics' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={3}
        sx={{
          background: '#181c2a',
          color: '#fff',
          fontFamily: 'Urbanist, sans-serif',
          top: showMobileNavbar ? 0 : '-64px',
          transition: 'top 0.3s',
          zIndex: 1200,
        }}
      >
        <Toolbar>
          {/* Hamburger for mobile */}
          <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, mr: 1 }}>
            <IconButton onClick={handleDrawerOpen} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Left: Empty for spacing (hidden on mobile, replaced by search bar on desktop) */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
          {/* Center: Logo and Brand Name */}
          <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', textDecoration: 'none' }} component={RouterLink} to="/">
            <Box component="img" src={logo} alt="Taylance CRM Logo" sx={{ width: 40, height: 40, borderRadius: 2, mr: 1, background: '#232946', p: 0.5, boxShadow: 1 }} />
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontFamily: 'Urbanist, sans-serif', fontSize: 26,display: { xs: 'none', sm: 'block' } }}>
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
              slotProps={{ paper:{sx: { mt: 1.5, minWidth: 180, borderRadius: 2, bgcolor: '#181c2a', color: '#fff', boxShadow: 6} } }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #4f8cff', textAlign: 'center' }}>
                <Avatar src={profilePic} alt={fullname || 'User'} sx={{ width: 48, height: 48, mx: 'auto', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>{fullname}</Typography>
              </Box>
              <MenuItem component={RouterLink} to="/user" onClick={handleMenuClose} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Profile</MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleMenuClose} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Settings</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#fff', fontFamily: 'Urbanist, sans-serif' }}>Logout</MenuItem>
              <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem sx={{ color: 'inherit', fontFamily: 'Urbanist, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {mode === 'dark' ? <Brightness4Icon /> : mode === 'light' ? <Brightness7Icon /> : <LaptopIcon />}
                  Theme
                  <Box component="span" sx={{ fontSize: 12, ml: 1, color: 'text.secondary' }}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Box>
                </Box>
                <ColorModeSelect
                  size="small"
                  sx={{ mt: 1, minWidth: 120, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                  
                  renderValue={value => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {value === 'dark' ? <Brightness4Icon fontSize="small" /> : value === 'light' ? <Brightness7Icon fontSize="small" /> : <LaptopIcon fontSize="small" />}
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Box>
                  )}
                />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Spacer to keep content from jumping when navbar hides */}
      <Box sx={{ height: { xs: '56px', sm: '56px', md: '64px' } }} />
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240, background: '#181c2a', color: '#fff', fontFamily: 'Urbanist, sans-serif' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={handleDrawerClose}>
            <Box component="img" src={logo} alt="Taylance CRM Logo" sx={{ width: 36, height: 36, borderRadius: 2, mr: 1 }} />
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'Urbanist, sans-serif' }}>CRM</Typography>
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: '#4f8cff', opacity: 0.2 }} />
        <List>
          <ListItem sx={{ px: 2, py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <IconButton sx={{ color: '#fff', mr: 1 }} onClick={handleDrawerSearchIcon}>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search by Tracking #, Customer, Phone, Product, Order ID, Courier..."
                sx={{ color: '#fff', background: '#232946', borderRadius: 2, px: 1.5, flex: 1, fontFamily: 'Raleway, sans-serif', border: '1px solid #4f8cff', height: 36 }}
                value={drawerSearch}
                onChange={e => setDrawerSearch(e.target.value)}
                onKeyDown={handleDrawerSearch}
              />
            </Box>
          </ListItem>
          {navItems.map((item) => (
            <Tooltip title={item.text} placement="right" key={item.text} disableHoverListener>
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                onClick={handleDrawerClose}
                sx={{
                  color: '#fff',
                  borderRadius: 2,
                  my: 0.5,
                  mx: 1,
                  '&:hover': { background: '#4f8cff', color: '#fff' },
                  minHeight: 48,
                  px: 2,
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2, justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ fontFamily: 'Urbanist, sans-serif' }} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ pb: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={profilePic} alt="User" sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#fff' }} />
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', fontFamily: 'Urbanist, sans-serif' }}>{fullname}</Typography>
          </Box>
          <IconButton onClick={() => { handleLogout(); handleDrawerClose(); }} sx={{ color: '#fff', ml: 1 }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
