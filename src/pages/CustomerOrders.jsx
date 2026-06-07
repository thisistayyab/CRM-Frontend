import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import DataGridTable from '../Components/DataGridTable';
import OrderItemsCell from '../Components/OrderItemsCell';
import { getDataGridContainerSx, getPageShellSx } from '../utils/dataGridStyles';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import MIUIAlert from '../Components/MIUIAlert';
import MIUILoader from '../Components/MIUILoader';
import { api } from '../server';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

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
    if (!tracking) return '-';
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
      : '-'
  ) },
  { field: 'phoneNumber', headerName: 'Phone', width: 130 },
  { field: 'customerAddress', headerName: 'Address', width: 180 },
  { field: 'shippingCharges', headerName: 'Shipping', width: 100 },
  { field: 'totalPrice', headerName: 'Total Price', width: 120 },
  { field: 'items', headerName: 'Items', minWidth: 110, flex: 0.6, sortable: false, renderCell: (params) => (
    <OrderItemsCell items={Array.isArray(params.row.item) ? params.row.item : []} />
  ) },
  { field: 'orderCountForCustomer', headerName: 'Customer Order Count', width: 180, renderCell: (params) => (
    params.value && params.row.phoneNumber ? (
      <Link component={RouterLink} to={`/customer-orders/${params.row.phoneNumber}`} underline="hover" color="primary">
        {params.value} order{params.value > 1 ? 's' : ''}
      </Link>
    ) : '-'
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

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/by-phone/${phoneNumber}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setRows(
            data.data
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
        mode={theme.palette.mode}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        sx={getPageShellSx()}
      >
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Orders for {phoneNumber}
        </Typography>
        <Box sx={getDataGridContainerSx(theme)}>
          {loading ? (
            <Box sx={{ minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MIUILoader message="Loading customer orders..." />
            </Box>
          ) : (
            <DataGridTable
              rows={rows}
              columns={columns}
              emptyMessage="No orders found for this customer."
              pageSize={25}
            />
          )}
        </Box>
      </Box>
    </>
  );
} 
