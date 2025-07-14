import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../server';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ConfirmDialog from '../Components/ConfirmDialog';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

export default function Inventory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [search, setSearch] = useState("");
  const theme = useTheme();

  // Move these handlers above columns so they are in scope
  const handleMenuOpen = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setMenuRow(row);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const columns = [
    {
      field: 'productName',
      headerName: 'Product',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{params.value}</div>
      ),
    },
    { field: 'quantity', headerName: 'Stock', type: 'number', flex: 0.5, minWidth: 100 },
    { field: 'location', headerName: 'Location', flex: 1, minWidth: 120 },
    { field: 'minStock', headerName: 'Min Stock', type: 'number', flex: 0.5, minWidth: 100 },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1, minWidth: 160 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <IconButton size="small" onClick={e => handleMenuOpen(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api}/v1/api/inventory`, { credentials: 'include' });
      const data = await res.json();
      if (data.data) {
        setRows(
          data.data.map(item => ({
            id: item._id,
            productName: item.product?.productname || item.product?.name || 'N/A',
            quantity: item.quantity,
            location: item.location,
            minStock: item.minStock,
            lastUpdated: new Date(item.lastUpdated).toLocaleString(),
            _raw: item,
          }))
        );
      }
    } catch (err) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Edit Inventory Item
  const [editForm, setEditForm] = useState({ quantity: '', location: '', minStock: '' });
  useEffect(() => {
    if (editItem) setEditForm({ quantity: editItem.quantity, location: editItem.location, minStock: editItem.minStock });
  }, [editItem]);
  const handleEditChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleEditSubmit = async () => {
    if (!editItem) return;
    try {
      const res = await fetch(`${api}/v1/api/inventory/${editItem._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setAlert({ open: true, type: 'success', message: 'Inventory item updated!' }); setAlertKey(k => k + 1);
        setEditOpen(false); setEditItem(null);
        fetchInventory();
      } else {
        setAlert({ open: true, type: 'error', message: 'Failed to update inventory item.' }); setAlertKey(k => k + 1);
      }
    } catch {
      setAlert({ open: true, type: 'error', message: 'Error updating inventory item.' }); setAlertKey(k => k + 1);
    }
  };

  // Delete Inventory Item
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    try {
      const res = await fetch(`${api}/v1/api/inventory/${pendingDeleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setRows(prev => prev.filter(row => row.id !== pendingDeleteId));
        setAlert({ open: true, type: 'success', message: 'Inventory item deleted!' }); setAlertKey(k => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: 'Failed to delete inventory item.' }); setAlertKey(k => k + 1);
      }
    } catch {
      setAlert({ open: true, type: 'error', message: 'Error deleting inventory item.' }); setAlertKey(k => k + 1);
    } finally {
      setPendingDeleteId(null);
      fetchInventory();
    }
  };

  // Filtered rows based on search
  const filteredRows = React.useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(row => {
      const productName = (row.productName || '').toLowerCase();
      return productName.includes(q);
    });
  }, [rows, search]);

  // Add a dialog close handler to blur active element and close dialog
  const handleEditDialogClose = () => {
    setEditOpen(false);
    setEditItem(null);
    if (document.activeElement) document.activeElement.blur();
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: theme.palette.mode === 'dark' ? '#181c2a' : '#f8fafd',
          color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
        }}
      >
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📦 Inventory
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' }, width: '100%' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Product Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ minWidth: { sm: 300 }, flex: 1 }}
            />
          </Box>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Box margin={2} paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 70px)', background: theme.palette.mode === 'dark' ? '#121212' : theme.palette.background.paper, color: theme.palette.text.primary, overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
            {loading ? (
              <MIUILoader message="Loading inventory..." />
            ) : (
              <DataGrid
                rows={filteredRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? '#333' : 'divider',
                  color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : theme.palette.background.paper,
                  '& .MuiDataGrid-cell': {
                    borderBottom: theme.palette.mode === 'dark' ? '1px solid #444' : undefined,
                    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.background.default,
                    borderBottom: theme.palette.mode === 'dark' ? '1px solid #444' : undefined,
                    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : theme.palette.background.default,
                    borderTop: theme.palette.mode === 'dark' ? '1px solid #444' : undefined,
                    color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
                  },
                  '& .MuiDataGrid-row': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#fff',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#232946' : '#f5f5f5',
                  },
                  '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#232946' : '#e0e0e0',
                  },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                    border: 'none',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    '&::-webkit-scrollbar': {
                      width: 8,
                      backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#f5f5f5',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#c1c1c1',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#b0b0b0',
                    },
                    scrollbarColor: theme.palette.mode === 'dark'
                      ? '#000 #000'
                      : '#c1c1c1 #f5f5f5',
                  },
                }}
              />
            )}
          </Box>
        </motion.div>
        <Dialog open={!!editItem} onClose={handleEditDialogClose}>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Quantity"
              name="quantity"
              type="number"
              value={editForm.quantity || ''}
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{ style: { color: theme.palette.mode === 'dark' ? '#fff' : undefined } }}
            />
            <TextField
              margin="dense"
              label="Location"
              name="location"
              value={editForm.location || ''}
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{ style: { color: theme.palette.mode === 'dark' ? '#fff' : undefined } }}
            />
            <TextField
              margin="dense"
              label="Min Stock"
              name="minStock"
              type="number"
              value={editForm.minStock || ''}
              onChange={handleEditChange}
              fullWidth
              InputLabelProps={{ style: { color: theme.palette.mode === 'dark' ? '#fff' : undefined } }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleEditDialogClose}
              variant="outlined"
              sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
                borderColor: theme.palette.mode === 'dark' ? '#444' : 'divider'
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem onClick={() => { setEditItem(menuRow?._raw || menuRow); setEditOpen(true); handleMenuClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { setPendingDeleteId(menuRow?.id); setConfirmOpen(true); handleMenuClose(); }} sx={{ color: 'error.main' }}>Delete</MenuItem>
        </Menu>
        <MIUIAlert
          open={alert.open}
          type={alert.type}
          message={alert.message}
          onClose={handleAlertClose}
          alertKey={alertKey}
          mode={theme.palette.mode}
        />
        <ConfirmDialog
          open={confirmOpen}
          title="Delete Inventory Item?"
          message="Are you sure you want to delete this inventory item? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </Box>
    </>
  );
} 