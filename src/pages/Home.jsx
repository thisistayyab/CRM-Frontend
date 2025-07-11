import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import MIUIAlert from '../Components/MIUIAlert';
import { api } from "../server";
import logo from '../assets/images/logo.png';
import avatar from '../assets/images/users/avatar.jpg';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'User', icon: <PersonIcon />, path: '/user' },
  { text: 'Products', icon: <ShoppingBagIcon />, path: '/products' },
  { text: 'Analytics', icon: <PieChartIcon />, path: '/analytics' },
  { text: 'Order', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Setting', icon: <SettingsIcon />, path: '/settings' },
];

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const [user, setUser] = useState({ name: '', profilepic: avatar });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${api}/v1/api/user/get-user`, {
          method: 'GET',
          credentials: 'include',
        });
        const result = await res.json();
        if (result.data) {
          setUser({
            name: result.data.fullname || '',
            profilepic: result.data.profilepic || avatar,
          });
        }
      } catch (err) {
        setUser({ name: '', profilepic: avatar });
      }
    };
    fetchUser();
  }, []);

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${api}/v1/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error){
        setAlert({ open: true, type: 'error', message: 'Logout failed.' });
        setAlertKey((k) => k + 1);
    }
    navigate("/login-signup");
  };

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
      <Navbar />
      {/* Desktop Sidebar and Content */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Drawer
          variant="permanent"
          open={isOpen}
          sx={{
            width: isOpen ? drawerWidth : 72,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isOpen ? drawerWidth : 72,
              boxSizing: 'border-box',
              background: '#181c2a',
              color: '#fff',
              transition: 'width 0.3s',
              borderRight: 0,
              overflowX: 'hidden',
              fontFamily: 'Urbanist, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              justifyContent: 'flex-start',
              p: 0,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: isOpen ? 'space-between' : 'center' }}>
            {isOpen && (
              <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Box component="img" src={logo} alt="Taylance CRM Logo" sx={{ width: 36, height: 36, borderRadius: 2, mr: 1 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'Urbanist, sans-serif' }}>CRM</Typography>
              </Box>
            )}
            <IconButton onClick={toggleSidebar} sx={{ color: '#fff', ml: isOpen ? 0 : 0 }}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: '#4f8cff', opacity: 0.2 }} />
          <List>
            <ListItem sx={{ px: 2, py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <IconButton sx={{ color: '#fff', mr: 1 }}>
                  <SearchIcon />
                </IconButton>
                {isOpen && (
                  <InputBase placeholder="Search..." sx={{ color: '#fff', background: '#232946', borderRadius: 2, px: 1.5, flex: 1, fontFamily: 'Raleway, sans-serif', border: '1px solid #4f8cff', height: 36 }} />
                )}
              </Box>
            </ListItem>
            {navItems.map((item) => (
              <Tooltip title={item.text} placement="right" key={item.text} disableHoverListener={isOpen}>
                <ListItem
                  button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    color: '#fff',
                    borderRadius: 2,
                    my: 0.5,
                    mx: 1,
                    background: location.pathname === item.path ? '#4f8cff' : 'transparent',
                    '&:hover': { background: '#4f8cff', color: '#fff' },
                    minHeight: 48,
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: 2,
                  }}
                >
                  <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: isOpen ? 2 : 'auto', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={item.text} sx={{ opacity: isOpen ? 1 : 0, fontFamily: 'Urbanist, sans-serif' }} />}
                </ListItem>
              </Tooltip>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ pb: 2, px: 2, display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center' }}>
            {isOpen ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={user.profilepic} alt="User" sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: '#fff' }} />
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', fontFamily: 'Urbanist, sans-serif' }}>{user.name}</Typography>
                </Box>
                <IconButton onClick={handleLogout} sx={{ color: '#fff', ml: 1 }}>
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                <LogoutIcon />
              </IconButton>
            )}
          </Box>
        </Drawer>
        <Box sx={{ ml: isOpen ? `${drawerWidth}px` : '72px', transition: 'margin-left 0.3s' }}>
          <section className="home-section">
            <Outlet />
          </section>
        </Box>
      </Box>
      {/* Mobile Content: show Outlet below Navbar, no sidebar */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <section className="home-section">
          <Outlet />
        </section>
      </Box>
    </>
  );
};

export default Home;
