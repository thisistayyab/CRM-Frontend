import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DataGridTable from '../Components/DataGridTable';
import GridRowActionsMenu from '../Components/GridRowActionsMenu';
import {
  getDataGridContainerSx,
  getPageShellSx,
  getPageToolbarSx,
  getPageToolbarFieldSx,
  getPageToolbarButtonSx,
} from '../utils/dataGridStyles';
import { Link as RouterLink } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import pic from '../assets/images/users/avatar-1.png';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MIUIAlert from '../Components/MIUIAlert';
import ConfirmDialog from '../Components/ConfirmDialog';
import LoadingButton from '../Components/LoadingButton';
import { api } from '../server';
import MIUILoader from '../Components/MIUILoader';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const API_URL = `${api}/v1/api/product`;

const buildColumns = () => [
  {
    field: 'image',
    headerName: '',
    width: 72,
    minWidth: 72,
    maxWidth: 72,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Box
        component="img"
        src={params.value || pic}
        alt=""
        sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover', bgcolor: 'action.hover' }}
      />
    ),
  },
  {
    field: 'productname',
    headerName: 'Product',
    flex: 1.4,
    minWidth: 180,
    renderCell: (params) => (
      <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4, py: 0.5 }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Stock',
    type: 'number',
    flex: 0.5,
    minWidth: 90,
    align: 'right',
    headerAlign: 'right',
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    flex: 0.5,
    minWidth: 90,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => (value != null ? `Rs ${value}` : '—'),
  },
  {
    field: 'salePrice',
    headerName: 'Sale Price',
    type: 'number',
    flex: 0.55,
    minWidth: 100,
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value) => (value != null ? `Rs ${value}` : '—'),
  },
  {
    field: 'category',
    headerName: 'Category',
    flex: 0.7,
    minWidth: 120,
  },
  {
    field: 'actions',
    headerName: '',
    width: 56,
    minWidth: 56,
    maxWidth: 56,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <GridRowActionsMenu
        onEdit={() => params.row.onEdit(params.row)}
        onDelete={() => params.row.onDelete(params.row.id)}
      />
    ),
  },
];

export default function Products() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = React.useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = React.useState(0); // for force remount
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const columns = React.useMemo(() => buildColumns(), []);

  // MIUI-style alert close handler
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setRows(
          data.data.map((prod) => ({
            ...prod,
            id: prod._id,
            onDelete: handleDelete,
            onEdit: handleEdit,
          }))
        );
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/${pendingDeleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setRows((prev) => prev.filter((row) => row.id !== pendingDeleteId));
        setAlert({ open: true, type: 'success', message: 'Product deleted successfully!' });
        setAlertKey((k) => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: 'Failed to delete product.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error deleting product.' });
      setAlertKey((k) => k + 1);
    } finally {
      setDeleteLoading(false);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    if (deleteLoading) return;
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleEdit = (row) => {
    setEditProduct(row);
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editProduct.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productname: editProduct.productname,
          price: editProduct.price,
          quantity: editProduct.quantity,
          description: editProduct.description,
          category: editProduct.category,
        }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((row) => row.id === editProduct.id ? { ...row, ...editProduct } : row));
        setEditProduct(null);
      } else {
        alert('Failed to update product');
      }
    } catch (err) {
      alert('Error updating product');
    } finally {
      setEditLoading(false);
    }
  };

  // Add Product logic (assume you have a handleAddProduct function)
  const handleAddProduct = async (product, imageFile) => {
    // Validate required fields
    if (!product.productname || !product.price || !product.quantity || !product.category) {
      setAlert({ open: true, type: 'warning', message: 'All required fields must be filled.' });
      setAlertKey((k) => k + 1);
      return;
    }
    if (!imageFile) {
      setAlert({ open: true, type: 'warning', message: 'Product image is required.' });
      setAlertKey((k) => k + 1);
      return;
    }
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => formData.append(key, value));
    formData.append('image', imageFile);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setAlert({ open: true, type: 'success', message: 'Product added successfully!' });
        setAlertKey((k) => k + 1);
        fetchProducts();
      } else if (data.message && data.message.toLowerCase().includes('image')) {
        setAlert({ open: true, type: 'warning', message: 'Product image is required.' });
        setAlertKey((k) => k + 1);
      } else if (data.message && data.message.toLowerCase().includes('required')) {
        setAlert({ open: true, type: 'warning', message: 'All required fields must be filled.' });
        setAlertKey((k) => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: 'Error processing your request.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error processing your request.' });
      setAlertKey((k) => k + 1);
    }
  };

  // Filtered rows based on search
  const filteredRows = React.useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(row => {
      const productName = (row.productname || row.name || '').toLowerCase();
      return productName.includes(q);
    });
  }, [rows, search]);

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        sx={getPageShellSx()}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Products
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
          <Button
            component={RouterLink}
            to="/addproduct"
            variant="contained"
            color="primary"
            sx={getPageToolbarButtonSx()}
          >
            Add Product
          </Button>
        </Box>
        <Box sx={getDataGridContainerSx(theme)}>
          {loading ? (
            <Box sx={{ minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MIUILoader message="Loading products..." />
            </Box>
          ) : (
            <DataGridTable
              rows={filteredRows}
              columns={columns}
              emptyMessage="No products yet. Add your first product to get started."
              pageSize={25}
            />
          )}
        </Box>
      </Box>
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            name="productname"
            value={editProduct?.productname || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={editProduct?.description || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Category"
            name="category"
            value={editProduct?.category || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={editProduct?.price || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Inventory"
            name="quantity"
            type="number"
            value={editProduct?.quantity || ''}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Sale Price"
            name="salePrice"
            type="number"
            value={editProduct?.salePrice || ''}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProduct(null)} color="secondary">Cancel</Button>
          <LoadingButton onClick={handleEditSave} color="primary" variant="contained" loading={editLoading}>Save</LoadingButton>
        </DialogActions>
      </Dialog>
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
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmLoading={deleteLoading}
      />
    </>
  );
}
