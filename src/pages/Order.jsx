import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';

const API_URL = "http://localhost:8000/v1/api/product/orders";

const statusColors = {
  active: 'green',
  canceled: 'red',
  returned: 'darkorange',
};

const columns = [
  { field: 'orderId', headerName: 'Order ID', width: 120 },
  { field: 'customerName', headerName: 'Customer', width: 150 },
  { field: 'phoneNumber', headerName: 'Phone', width: 130 },
  { field: 'customerAddress', headerName: 'Address', width: 180 },
  { field: 'shippingCharges', headerName: 'Shipping', width: 100 },
  { field: 'totalPrice', headerName: 'Total Price', width: 120 },
  { field: 'items', headerName: 'Items', width: 250, renderCell: (params) => (
    <span>
      {Array.isArray(params.row.item) && params.row.item.length > 0
        ? params.row.item.map((item) => {
            const prod = item.product;
            const name = prod && (prod.productname || prod.name || 'Product');
            return `${name} (x${item.quantity})`;
          }).join(', ')
        : '—'}
    </span>
  ) },
  { field: 'status', headerName: 'Status', width: 140, renderCell: (params) => (
    <Chip
      label={params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)}
      sx={{
        color: '#fff',
        backgroundColor: statusColors[params.row.status],
        fontWeight: 'bold',
        minWidth: 100,
      }}
    />
  ) },
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
                params.row.onDelete(params.row.id);
              }}
              disabled={params.row.status !== 'canceled'}
              sx={{ color: 'red' }}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onCancel(params.row.id);
              }}
              disabled={params.row.status === 'canceled'}
              sx={{ color: 'orange' }}
            >
              Cancel
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                params.row.onStatusChange(params.row.id, 'returned');
              }}
              disabled={params.row.status === 'returned'}
              sx={{ color: 'darkorange' }}
            >
              Return
            </MenuItem>
          </Menu>
        </>
      );
    },
  },
];

export default function Orders() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.data) {
        setRows(
          data.data.map((order) => ({
            ...order,
            id: order._id,
            onDelete: handleDelete,
            onCancel: handleCancel,
            onStatusChange: handleStatusChange,
            quantities: order.item && Array.isArray(order.item) ? order.item.map(() => 1) : [],
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
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
      }
    } catch (err) {
      console.log(err)
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.log(err)
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let endpoint = '';
    if (newStatus === 'canceled') endpoint = `${API_URL}/${id}/cancel`;
    else if (newStatus === 'returned') endpoint = `${API_URL}/${id}/return`;
    else if (newStatus === 'active') endpoint = `${API_URL}/${id}`; // For future extension
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
        });
        fetchOrders();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className='order'>
        <h1>Orders</h1>
        <div>
          <Link to="/createorder">
            <button className='odr-btn effect'>Create Order</button>
          </Link>
        </div>
      </div>
      <Box paddingLeft={2} paddingRight={2} sx={{ height: '70%', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowClassName={(params) =>
            params.row.status === 'canceled' ? 'order-canceled-row' : params.row.status === 'returned' ? 'order-returned-row' : ''
          }
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
        />
      </Box>
    </>
  );
}