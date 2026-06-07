import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function GridRowActionsMenu({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        aria-label="row actions"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {onEdit && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onEdit();
            }}
          >
            {editLabel}
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            {deleteLabel}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
