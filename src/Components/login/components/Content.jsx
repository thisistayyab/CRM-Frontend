import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/Facebook';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import logo from '../../../assets/images/logo.png';
import { PRODUCT_NAME } from '../../../constants/brand';

const items = [
  {
    icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
    title: 'Facebook inbox → orders',
    description: 'Paste inbox messages and auto-fill customer details and products.',
  },
  {
    icon: <ContentPasteIcon sx={{ color: 'text.secondary' }} />,
    title: 'One order workspace',
    description: 'Track Facebook, WhatsApp, and phone orders without spreadsheets.',
  },
  {
    icon: <PeopleIcon sx={{ color: 'text.secondary' }} />,
    title: 'Customer history',
    description: 'See repeat buyers, VIPs, and full order history by phone number.',
  },
  {
    icon: <Inventory2OutlinedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Live inventory',
    description: 'Stock updates on completed orders with low-stock alerts.',
  },
];

export default function Content() {
  return (
    <Stack sx={{ gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src={logo} alt={`${PRODUCT_NAME} logo`} sx={{ width: 36, height: 36, mr: 1 }} />
        <Typography variant="h5" className="text-gradient" sx={{ fontWeight: 700 }}>
          {PRODUCT_NAME}
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 500 }}>{item.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.description}</Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
