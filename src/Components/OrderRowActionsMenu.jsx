import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function OrderRowActionsMenu({ row }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const status = row.status;

  return (
    <>
      <IconButton aria-label="order actions" onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          disabled={status !== 'canceled'}
          onClick={() => { setAnchorEl(null); row.onDelete(row.id); }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
        <MenuItem
          disabled={status === 'canceled'}
          onClick={() => { setAnchorEl(null); row.onCancel(row.id); }}
          sx={{ color: 'error.main' }}
        >
          Cancel
        </MenuItem>
        <MenuItem
          disabled={status === 'returned'}
          onClick={() => { setAnchorEl(null); row.onStatusChange(row.id, 'returned'); }}
          sx={{ color: 'warning.main' }}
        >
          Return
        </MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); row.onEdit(row); }}>
          Edit
        </MenuItem>
        <MenuItem
          disabled={status === 'complete'}
          onClick={() => { setAnchorEl(null); row.onComplete(row.id); }}
          sx={{ color: 'primary.main' }}
        >
          Complete
        </MenuItem>
      </Menu>
    </>
  );
}
