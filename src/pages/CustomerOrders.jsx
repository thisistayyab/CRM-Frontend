import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/product/orders";
// const API_URL = "http://localhost:8000/v1/api/product/orders";

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
      color={params.value === 'TCS' ? 'primary' : params.value === 'Leopard' ? 'warning' : 'default'}
      sx={{ fontWeight: 'bold', minWidth: 100 }}
    />
  ) },
];

export default function CustomerOrders() {
  const { phoneNumber } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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
        }
      })
      .finally(() => setLoading(false));
  }, [phoneNumber]);

  return (
    <Box paddingLeft={2} paddingRight={2} sx={{ height: 'calc(100vh - 180px)', width: '100%', background: '#fff', overflow: 'auto', borderRadius: 2, boxShadow: 1, mt: 2 }}>
      <h2>Orders for Customer (Phone: {phoneNumber})</h2>
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
  );
} 