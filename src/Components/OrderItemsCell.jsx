import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';

export default function OrderItemsCell({ items = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  if (!items.length) return '—';

  return (
    <>
      <Link
        component="button"
        underline="hover"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ cursor: 'pointer', color: 'primary.main' }}
      >
        {totalQty} item{totalQty > 1 ? 's' : ''}
      </Link>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5, minWidth: 180 }}>
          {items.map((item, idx) => {
            const prod = item.product;
            const name = prod?.productname || prod?.name || 'Product';
            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                  py: 0.5,
                  borderBottom: idx !== items.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <span>{name}</span>
                <span>×{item.quantity}</span>
              </Box>
            );
          })}
        </Box>
      </Popover>
    </>
  );
}
