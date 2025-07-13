import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link as RouterLink } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import pic from '../assets/images/users/avatar-1.png';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MIUIAlert from '../Components/MIUIAlert';
import ConfirmDialog from '../Components/ConfirmDialog';
import { api } from '../server';
import MIUILoader from '../Components/MIUILoader';
import { useTheme } from '@mui/material/styles';

const API_URL = `${api}/v1/api/product`;
// const API_URL = "http://localhost:8000/v1/api/product";
// const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product";

const columns = [
  {
    field: 'image',
    headerName: '',
    width: 60,
    renderCell: (params) => (
      <img
        src={params.value || pic}
        alt="product"
        style={{ width: 40, height: 40, borderRadius: '20%', marginTop: 5 }}
      />
    ),
  },
  {
    field: 'productname',
    headerName: 'Product',
    width: 200,
    editable: false,
    renderCell: (params) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {params.value}
      </div>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Inventory',
    type: 'number',
    width: 110,
    editable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    type: 'number',
    width: 110,
    editable: false,
  },
  {
    field: 'salePrice',
    headerName: 'Sale Price',
    type: 'number',
    width: 110,
    editable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 140,
    editable: false,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 80,
    renderCell: (params) => {
      const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      return (
        <>
          <IconButton
            aria-label="more"
            aria-controls={`actions-menu-${params.row.id}`}
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`actions-menu-${params.row.id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={theme => ({
              '& .MuiPaper-root': {
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
                color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
              },
            })}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onEdit(params.row);
              }}
              sx={theme => ({ color: theme.palette.text.primary })}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onDelete(params.row.id);
              }}
              sx={theme => ({ color: theme.palette.error.main })}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      );
    },
  },
];

export default function Products() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [alert, setAlert] = React.useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = React.useState(0); // for force remount
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const theme = useTheme();

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
      console.log(err)
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
    setConfirmOpen(false);
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
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
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
      console.log(err)
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
      <Box sx={{ px: 2, py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Products
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
          <Button
            component={RouterLink}
            to="/addproduct"
            variant="contained"
            color="primary"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Product
          </Button>
        </Box>
      </Box>
      <Box margin={2} paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 70px)', background: theme.palette.mode === 'dark' ? '#121212' : theme.palette.background.paper, color: theme.palette.text.primary, overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
        {loading ? (
          <MIUILoader message="Loading products..." />
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
            pageSizeOptions={[5]}
            checkboxSelection
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
          <Button onClick={handleEditSave} color="primary" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
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
      />
    </>
  );
}