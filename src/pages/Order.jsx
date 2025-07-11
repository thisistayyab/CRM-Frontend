import * as React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import '../assets/Stylesheets/Order.css'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import MIUIAlert from '../Components/MIUIAlert';
import ConfirmDialog from '../Components/ConfirmDialog';
import { api } from '../server';
import MIUILoader from '../Components/MIUILoader';

const API_URL =  `${api}/v1/api/product/orders`

// const API_URL = "http://localhost:8000/v1/api/product/orders";
// const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";

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
  { field: 'otherExpenses', headerName: 'Other Expenses', width: 130, renderCell: (params) => params.value != null ? params.value : 0 },
  { field: 'netProfit', headerName: 'Net Profit', width: 130, renderCell: (params) => {
    const value = params.value != null ? params.value : 0;
    return <span style={{ color: value < 0 ? 'red' : 'green', fontWeight: 'bold' }}>{value}</span>;
  } },
  { field: 'items', headerName: 'Items', width: 150, renderCell: (params) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const items = Array.isArray(params.row.item) ? params.row.item : [];
    const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    if (!items.length) return '—';
    return (
      <>
        <Link component="button" underline="hover" onClick={handleClick} sx={{ cursor: 'pointer' }}>
          {totalQty} item{totalQty > 1 ? 's' : ''}
        </Link>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 1, minWidth: 140 }}>
            {items.map((item, idx) => {
              const prod = item.product;
              const name = prod && (prod.productname || prod.name || 'Product');
              return (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: idx !== items.length - 1 ? '1px solid #eee' : 'none' }}>
                  <span>{name}</span>
                  <span>&nbsp;x{item.quantity}</span>
                </Box>
              );
            })}
          </Box>
        </Popover>
      </>
    );
  } },
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
  const [alert, setAlert] = React.useState({ open: false, type: 'success', message: '' });
  const [alertKey, setAlertKey] = React.useState(0);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState(null);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const location = useLocation();

  // Sync search state with query param
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    setSearch(q);
  }, [location.search]);

  // Filtered rows based on search
  const filteredRows = React.useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(row => {
      const orderId = typeof row.orderId === 'string' ? row.orderId.toLowerCase() : '';
      const trackingNumber = typeof row.trackingNumber === 'string' ? row.trackingNumber.toLowerCase() : '';
      const phoneNumber = typeof row.phoneNumber === 'string' ? row.phoneNumber.toLowerCase() : (row.phoneNumber ? String(row.phoneNumber).toLowerCase() : '');
      const customerName = typeof row.customerName === 'string' ? row.customerName.toLowerCase() : '';
      const courierCompany = typeof row.courierCompany === 'string' ? row.courierCompany.toLowerCase() : '';
      // Search product names in item array
      let productNames = '';
      if (Array.isArray(row.item)) {
        productNames = row.item.map(i => (i.product?.productname || i.product?.name || '')).join(' ').toLowerCase();
      }
      return (
        orderId.includes(q) ||
        trackingNumber.includes(q) ||
        phoneNumber.includes(q)
        || customerName.includes(q)
        || productNames.includes(q)
        || courierCompany.includes(q)
      );
    });
  }, [rows, search]);

  // CSV export helper
  const exportToCSV = () => {
    const selectedRows = selectionModel.length > 0
      ? rows.filter((row) => selectionModel.includes(row.id))
      : rows;
    if (selectedRows.length === 0) {
      setAlert({ open: true, type: 'info', message: 'No orders to export.' });
      setAlertKey((k) => k + 1);
      return;
    }
    // Define CSV headers
    const headers = [
      'Order ID', 'Tracking Number', 'Customer', 'Order Date', 'Phone', 'Address',
      'Shipping', 'Total Price', 'Other Expenses', 'Net Profit', 'Status', 'Courier Company'
    ];
    // Map rows to CSV, quoting all fields and formatting date
    const csvRows = [
      headers.join(','),
      ...selectedRows.map(row => [
        '"' + (row.orderId || '') + '"',
        '"' + (row.trackingNumber || '') + '"',
        '"' + (row.customerName || '') .replace(/"/g, '""') + '"',
        '"' + (row.createdAt ? new Date(row.createdAt).toLocaleString() : '') + '"',
        '"' + (row.phoneNumber || '') + '"',
        '"' + (row.customerAddress || '').replace(/"/g, '""') + '"',
        '"' + (row.shippingCharges != null ? row.shippingCharges : '') + '"',
        '"' + (row.totalPrice != null ? row.totalPrice : '') + '"',
        '"' + (row.otherExpenses != null ? row.otherExpenses : 0) + '"',
        '"' + (row.netProfit != null ? row.netProfit : 0) + '"',
        '"' + (row.status || '') + '"',
        '"' + (row.courierCompany || '') + '"'
      ].join(','))
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

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
        setAlert({ open: true, type: 'success', message: 'Order deleted successfully!' });
        setAlertKey((k) => k + 1);
      } else {
        const errData = await res.json();
        setAlert({ open: true, type: 'error', message: errData.message || 'Error deleting order.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error deleting order.' });
      setAlertKey((k) => k + 1);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        fetchOrders();
        setAlert({ open: true, type: 'success', message: 'Order canceled.' });
        setAlertKey((k) => k + 1);
      } else {
        const errData = await res.json();
        setAlert({ open: true, type: 'error', message: errData.message || 'Error canceling order.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error canceling order.' });
      setAlertKey((k) => k + 1);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let endpoint = '';
    if (newStatus === 'canceled') endpoint = `${API_URL}/${id}/cancel`;
    else if (newStatus === 'returned') endpoint = `${API_URL}/${id}/return`;
    else if (newStatus === 'active') endpoint = `${API_URL}/${id}`; // For future extension
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
        });
        if (res.ok) {
          fetchOrders();
          setAlert({ open: true, type: 'success', message: `Order marked as ${newStatus}.` });
          setAlertKey((k) => k + 1);
        } else {
          const errData = await res.json();
          setAlert({ open: true, type: 'error', message: errData.message || `Error updating order status to ${newStatus}.` });
          setAlertKey((k) => k + 1);
        }
      } catch (err) {
        setAlert({ open: true, type: 'error', message: `Error updating order status to ${newStatus}.` });
        setAlertKey((k) => k + 1);
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
        setAlert({ open: true, type: 'success', message: 'Order marked as complete.' });
        setAlertKey((k) => k + 1);
      } else {
        const errData = await res.json();
        setAlert({ open: true, type: 'error', message: errData.message || 'Error marking order as complete.' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      setAlert({ open: true, type: 'error', message: 'Error marking order as complete.' });
      setAlertKey((k) => k + 1);
    }
  };

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
        autoHideDuration={5000}
        transitionProps={{ timeout: 500 }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Order?"
        message="Are you sure you want to delete this order? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { sm: 'center' },
          width: '100%',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by Order ID, Tracking Number, Phone, Customer, Product, Courier Company"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            // Update URL query param
            const params = new URLSearchParams(location.search);
            if (e.target.value) {
              params.set('search', e.target.value);
            } else {
              params.delete('search');
            }
            window.history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
          }}
          sx={{ minWidth: { sm: 300 }, flex: 1 }}
        />

        <Button
          component={RouterLink}
          to="/createorder"
          variant="contained"
          color="primary"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Create Order
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={exportToCSV}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Export
        </Button>
      </Box>
    </Box>
      <Box margin={2} paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 70px)', background: '#fff', overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
        {loading ? (
          <MIUILoader message="Loading orders..." />
        ) : (
          <DataGrid
            rows={filteredRows}
            columns={columns}
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
            onRowSelectionModelChange={setSelectionModel}
            selectionModel={selectionModel}
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
        )}
      </Box>
    </>
  );
}