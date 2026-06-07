import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import FacebookIcon from '@mui/icons-material/Facebook';

export const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Facebook Import', icon: <FacebookIcon />, path: '/facebook-import' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Products', icon: <ShoppingBagIcon />, path: '/products' },
  { text: 'Inventory', icon: <Inventory2OutlinedIcon />, path: '/inventory' },
  { text: 'Store', icon: <StoreIcon />, path: '/store' },
  { text: 'Analytics', icon: <PieChartIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export function navigateFromSearch(query, navigate) {
  const q = query.trim();
  if (!q) return;
  if (/^\d{7,}$/.test(q)) {
    navigate(`/customer-orders/${q}`);
  } else if (/[a-zA-Z]/.test(q)) {
    navigate(`/customers?search=${encodeURIComponent(q)}`);
  } else {
    navigate(`/orders?search=${encodeURIComponent(q)}`);
  }
}
