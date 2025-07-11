import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { api } from '../server';

// const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";
// const API_URL = "http://localhost:8000/v1/api/product/orders";
const API_URL = `${api}/v1/api/product/orders`;

const statusColors = {
  active: 'green',
  canceled: 'red',
  returned: 'darkorange',
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
                  <span>x{item.quantity}</span>
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
      color={params.value === 'TCS' ? 'primary' : params.value === 'Leopard' ? 'warning' : 'default'}
      sx={{ fontWeight: 'bold', minWidth: 100 }}
    />
  ) },
];

export default function CustomerOrders() {
  const { phoneNumber } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };

  useEffect(() => {
    setLoading(true);
    fetch(API_URL, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setRows(
            data.data
              .filter(order => String(order.phoneNumber) === String(phoneNumber))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(order => ({
                ...order,
                id: order._id,
              }))
          );
        } else {
          setAlert({ open: true, type: 'error', message: data.message || 'Error loading customer orders.' });
          setAlertKey((k) => k + 1);
        }
      })
      .catch(err => {
        setAlert({ open: true, type: 'error', message: 'Error loading customer orders.' });
        setAlertKey((k) => k + 1);
      })
      .finally(() => setLoading(false));
  }, [phoneNumber]);

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
        />
      <Box paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 70px)', background: '#fff', overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
        <h2>Orders for Customer (Phone: {phoneNumber})</h2>
        {loading ? (
          <MIUILoader message="Loading customer orders..." />
        ) : (
          <DataGrid
            rows={rows}
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