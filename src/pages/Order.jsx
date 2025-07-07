import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

// const API_URL = "http://localhost:8000/v1/api/product/orders";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";

const statusColors = {
  active: 'green',
  canceled: 'red',
  returned: 'darkorange',
  complete: 'blue',
};

const columns = [
  { field: 'trackingNumber', headerName: 'Tracking Number', width: 150, renderCell: (params) => {
    const tracking = params.value;
    const courier = params.row.courierCompany;
    if (!tracking) return '—';
    if (courier === 'TCS') {
      return <Link href={`https://www.tcsexpress.com/track/${tracking}`} target="_blank" rel="noopener noreferrer">{tracking}</Link>;
    } else if (courier === 'Leopard') {
      return <Link href={`https://www.leopardscourier.com/shipment_tracking?cn_number=${tracking}`} target="_blank" rel="noopener noreferrer">{tracking}</Link>;
    } else {
      return tracking;
    }
  } },
  { field: 'orderId', headerName: 'Order ID', width: 120, renderCell: (params) => (
    <Link component={RouterLink} to={`/vieworder/${params.row.id}`} underline="hover" color="primary">
      {params.value}
    </Link>
  ) },
  { field: 'customerName', headerName: 'Customer', width: 150 },
  { field: 'orderDate', headerName: 'Order Date', width: 160, renderCell: (params) => (
    params.row && params.row.createdAt
      ? new Date(params.row.createdAt).toLocaleString()
      : '—'
  ) },
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
  { field: 'orderCountForCustomer', headerName: 'Customer Order Count', width: 180, renderCell: (params) => (
    params.value && params.row.phoneNumber ? (
      <Link component={RouterLink} to={`/customer-orders/${params.row.phoneNumber}`} underline="hover" color="primary">
        {params.value} order{params.value > 1 ? 's' : ''}
      </Link>
    ) : '—'
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
  { field: 'courierCompany', headerName: 'Courier Company', width: 160, renderCell: (params) => (
    <Chip
      label={params.value || 'Custom'}
      color={params.value === 'TCS' ? 'error' : params.value === 'Leopard' ? 'warning' : 'default'}
      sx={{ fontWeight: 'bold', minWidth: 100 }}
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
              sx={{ color: 'red' }}
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
                params.row.onComplete(params.row.id);
              }}
              disabled={params.row.status === 'complete'}
              sx={{ color: 'blue' }}
            >
              Complete
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
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.data) {
        const sortedOrders = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRows(
          sortedOrders.map((order) => ({
            ...order,
            id: order._id,
            onDelete: handleDelete,
            onCancel: handleCancel,
            onStatusChange: handleStatusChange,
            onEdit: handleEdit,
            onComplete: handleComplete,
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

  const handleEdit = (order) => {
    navigate(`/editorder/${order.id}`);
  };

  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/complete`, {
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

  return (
    <>
      <div className='order'>
        <h1>Orders</h1>
        <div>
          <Button
            component={RouterLink}
            to="/createorder"
            className='odr-btn effect'
            variant="contained"
            color="primary"
          >
            Create Order
          </Button>
        </div>
      </div>
      <Box paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 180px)', width: '100%', background: '#fff', overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
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
          sx={{
            '& .MuiDataGrid-virtualScroller': {
              overflowX: 'auto',
            },
            '& .MuiDataGrid-main': {
              background: '#fff',
            },
            border: 0,
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
    </>
  );
}