import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import DataGridTable from '../Components/DataGridTable';
import { getDataGridContainerSx, getPageShellSx, getPageToolbarSx, getPageToolbarFieldSx } from '../utils/dataGridStyles';
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
import LoadingButton from '../Components/LoadingButton';
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
  const [editSaving, setEditSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      flex: 2.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4, py: 0.5 }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'quantity', headerName: 'Stock', type: 'number', flex: 1, minWidth: 100, align: 'right', headerAlign: 'right' },
    { field: 'location', headerName: 'Location', flex: 1.5, minWidth: 140 },
    { field: 'minStock', headerName: 'Min Stock', type: 'number', flex: 1, minWidth: 110, align: 'right', headerAlign: 'right' },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1.5, minWidth: 170 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 88,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton size="small" onClick={e => handleMenuOpen(e, params.row)}>
          <MoreVertIcon fontSize="small" />
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
    setEditSaving(true);
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
    } finally {
      setEditSaving(false);
    }
  };

  // Delete Inventory Item
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteLoading(true);
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
      setDeleteLoading(false);
      setConfirmOpen(false);
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
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          sx={getPageShellSx()}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Inventory
          </Typography>
          <Box sx={{ ...getPageToolbarSx(), mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Product Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={getPageToolbarFieldSx()}
            />
          </Box>
          <Box sx={getDataGridContainerSx(theme)}>
            {loading ? (
              <Box sx={{ minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MIUILoader message="Loading inventory..." />
              </Box>
            ) : (
              <DataGridTable
                rows={filteredRows}
                columns={columns}
                emptyMessage="No inventory items yet."
                pageSize={25}
              />
            )}
          </Box>
        </Box>
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
            />
            <TextField
              margin="dense"
              label="Location"
              name="location"
              value={editForm.location || ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Min Stock"
              name="minStock"
              type="number"
              value={editForm.minStock || ''}
              onChange={handleEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleEditDialogClose}
              variant="outlined"
              sx={{
                color: 'text.primary',
                borderColor: 'divider'
              }}
            >
              Cancel
            </Button>
            <LoadingButton onClick={handleEditSubmit} color="primary" variant="contained" loading={editSaving}>Save</LoadingButton>
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
          onCancel={() => { if (!deleteLoading) setConfirmOpen(false); }}
          confirmText="Delete"
          cancelText="Cancel"
          confirmLoading={deleteLoading}
        />
      </Box>
    </>
  );
} 
