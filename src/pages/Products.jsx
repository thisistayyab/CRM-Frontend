import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import pic from '../assets/images/users/avatar-1.png';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MIUIAlert from '../Components/MIUIAlert';
import ConfirmDialog from '../Components/ConfirmDialog';

// const API_URL = "http://localhost:8000/v1/api/product";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product";

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
          >
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onEdit(params.row);
              }}
              sx={{ color: 'black' }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onDelete(params.row.id);
              }}
              sx={{ color: 'red' }}
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

  return (
    <>
      <div className='order'>
        <h1>Products</h1>
        <div>
          <Link to="/addproduct">
            <button className='odr-btn effect'>Add Product</button>
          </Link>
        </div>
      </div>
      <Box paddingLeft={2} paddingRight={2} sx={{ height: '70%', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
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
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
              border: 'none',
            },
            '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {
              backgroundColor: 'inherit',
            },
          }}
        />
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