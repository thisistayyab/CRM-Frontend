import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
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
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ListItemButton from '@mui/material/ListItemButton';
import ThemeToggle from '../Components/ThemeToggle';
import { navItems, navigateFromSearch } from '../constants/navItems';
import { SIDEBAR_WIDTH, MOBILE_HEADER_HEIGHT } from '../constants/layout';
import { PRODUCT_NAME } from '../constants/brand';
import CompanyAttribution from '../Components/CompanyAttribution';

const SidebarContent = ({ user, location, sidebarSearch, setSidebarSearch, onSearch, onLogout, onNavClick }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box component={Link} to="/" onClick={onNavClick} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flex: 1, minWidth: 0 }}>
          <Box component="img" src={logo} alt={PRODUCT_NAME} sx={{ width: 36, height: 36, borderRadius: 2, mr: 1, flexShrink: 0 }} />
          <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 18 }} noWrap>
            {PRODUCT_NAME}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 0.5 }}>
        <ListItem sx={{ px: 1, py: 0.5 }}>
          <InputBase
            placeholder="Search name, phone, order..."
            fullWidth
            sx={{
              color: 'text.primary',
              bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'action.hover',
              borderRadius: 2, px: 1.5, fontSize: 14,
              border: '1px solid', borderColor: 'divider', height: 36
            }}
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
        </ListItem>
        {navItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={onNavClick}
            sx={{
              borderRadius: 2, my: 0.25, minHeight: 42,
              '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } },
              '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText', '& .MuiListItemIcon-root': { color: 'inherit' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <MenuItem component={Link} to="/user" onClick={onNavClick} sx={{ borderRadius: 2, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><PersonIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: 14 }} />
        </MenuItem>
        <MenuItem component={Link} to="/settings" onClick={onNavClick} sx={{ borderRadius: 2, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 32 }}><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: 14 }} />
        </MenuItem>
        <Box sx={{ px: 1, py: 1.5 }}>
          <ThemeToggle />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src={user.profilepic} alt={user.name} sx={{ width: 36, height: 36 }} />
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name || 'User'}
        </Typography>
        <IconButton size="small" onClick={onLogout} title="Logout">
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <CompanyAttribution sx={{ fontSize: 11 }} />
      </Box>
    </>
  );
};

const drawerPaperSx = {
  width: SIDEBAR_WIDTH,
  boxSizing: 'border-box',
  bgcolor: 'background.paper',
  color: 'text.primary',
  borderRight: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const Home = () => {
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const [user, setUser] = useState({ name: '', profilepic: avatar });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`${api}/v1/api/user/get-user`, { credentials: 'include' })
      .then(r => r.json())
      .then(result => {
        if (result.data) {
          setUser({ name: result.data.fullname || '', profilepic: result.data.profilepic || avatar });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${api}/v1/api/user/logout`, { method: "POST", credentials: "include" });
    } catch {
      setAlert({ open: true, type: 'error', message: 'Logout failed.' });
      setAlertKey(k => k + 1);
    }
    navigate("/login");
  };

  const handleSearch = () => {
    if (sidebarSearch.trim()) {
      navigateFromSearch(sidebarSearch, navigate);
      setMobileOpen(false);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarProps = {
    user, location, sidebarSearch, setSidebarSearch,
    onSearch: handleSearch, onLogout: handleLogout, onNavClick: closeMobile
  };

  return (
    <>
      <MIUIAlert open={alert.open} type={alert.type} message={alert.message}
        onClose={() => setAlert(a => ({ ...a, open: false }))} alertKey={alertKey} />

      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Desktop sidebar — full height, no top bar */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexShrink: 0 }}>
          <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { ...drawerPaperSx, position: 'relative', height: '100vh' } }}>
            <SidebarContent {...sidebarProps} onNavClick={() => {}} />
          </Drawer>
        </Box>

        {/* Main column */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* Mobile-only slim header */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center', height: MOBILE_HEADER_HEIGHT, px: 1.5,
            borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0
          }}>
            <IconButton onClick={() => setMobileOpen(true)} edge="start">
              <MenuIcon />
            </IconButton>
            <Typography fontWeight={700} fontSize={16} sx={{ ml: 1 }}>{PRODUCT_NAME}</Typography>
          </Box>

          <Box component="main" className="home-section" sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={mobileOpen}
        onClose={closeMobile}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { ...drawerPaperSx, height: '100%' } }}
      >
        <SidebarContent {...sidebarProps} />
      </Drawer>
    </>
  );
};

export default Home;
