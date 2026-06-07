import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import Dot from './@extended/Dot.jsx';
import ChartEmptyState from './ChartEmptyState';

const headCells = [
  { id: 'tracking_no', align: 'left', label: 'Tracking No.' },
  { id: 'name', align: 'left', label: 'Product Name' },
  { id: 'orderId', align: 'right', label: 'Order ID' },
  { id: 'status', align: 'left', label: 'Status' },
  { id: 'totalAmount', align: 'right', label: 'Total Amount' }
];

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell key={cell.id} align={cell.align} padding="normal">
            {cell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;
  switch (status) {
    case 'complete':
      color = 'success';
      title = 'Complete';
      break;
    case 'pending':
      color = 'warning';
      title = 'Pending';
      break;
    case 'canceled':
      color = 'error';
      title = 'Canceled';
      break;
    default:
      color = 'default';
      title = status || 'None';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function OrderTable({ orders = [] }) {
  const rows = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
    [orders]
  );

  if (rows.length === 0) {
    return (
      <ChartEmptyState
        height={220}
        message="No recent orders"
        hint="Orders you create will appear here."
      />
    );
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          maxWidth: '100%',
          maxHeight: 400,
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle" size="small">
          <OrderTableHead />
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              const productNames = Array.isArray(row.item)
                ? row.item.map(i => (i.product?.productname || i.product?.name || 'Product')).join(', ')
                : '';
              return (
                <TableRow
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row._id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link
                      color="secondary"
                      href={
                        row.courierCompany === 'TCS'
                          ? `https://www.tcsexpress.com/track/${row.trackingNumber}`
                          : row.courierCompany === 'Leopard'
                          ? `https://www.leopardscourier.com/shipment_tracking?cn_number=${row.trackingNumber}`
                          : undefined
                      }
                      target={row.courierCompany === 'TCS' || row.courierCompany === 'Leopard' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                    >
                      {row.trackingNumber || '—'}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ pl: 2, pr: 2, maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {productNames}
                  </TableCell>
                  <TableCell align="right">
                    <Link component={RouterLink} to={`/vieworder/${row._id}`} underline="hover" color="primary">
                      {row.orderId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <OrderStatus status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.totalPrice} displayType="text" thousandSeparator prefix="PKR " />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTable.propTypes = { orders: PropTypes.array };
OrderStatus.propTypes = { status: PropTypes.string };
