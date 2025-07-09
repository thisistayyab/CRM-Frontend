import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// material-ui
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

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from './@extended/Dot.jsx';
import { api } from '../../server.js';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'tracking_no',
    align: 'left',
    disablePadding: false,
    label: 'Tracking No.'
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Product Name'
  },
  {
    id: 'orderId',
    align: 'right',
    disablePadding: false,
    label: 'Order ID'
  },
  {
    id: 'carbs',
    align: 'left',
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'protein',
    align: 'right',
    disablePadding: false,
    label: 'Total Amount'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
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
    case 'active':
      color = 'success';
      title = 'Active';
      break;
    case 'canceled':
      color = 'error';
      title = 'Canceled';
      break;
    case 'returned':
      color = 'warning';
      title = 'Returned';
      break;
    case 'complete':
      color = 'primary';
      title = 'Complete';
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

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(`${api}/v1/api/product/orders`, { credentials: 'include' })
    // fetch('http://localhost:8000/v1/api/product/orders', { credentials: 'include' })
    // fetch('https://crm-backend-rho-weld.vercel.app/v1/api/product/orders', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const sorted = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRows(sorted.slice(0, 10));
        }
      });
  }, []);

  const order = 'asc';
  const orderBy = 'tracking_no';

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              const productNames = Array.isArray(row.item)
                ? row.item.map(i => (i.product?.productname || i.product?.name || 'Product')).join(', ')
                : '';
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row._id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    <Link color="secondary" href={
                      row.courierCompany === 'TCS'
                        ? `https://www.tcsexpress.com/track/${row.trackingNumber}`
                        : row.courierCompany === 'Leopard'
                        ? `https://www.leopardscourier.com/shipment_tracking?cn_number=${row.trackingNumber}`
                        : undefined
                    } target={row.courierCompany === 'TCS' || row.courierCompany === 'Leopard' ? '_blank' : undefined} rel="noopener noreferrer">
                      {row.trackingNumber || '—'}
                    </Link>
                  </TableCell>
                  <TableCell style={{paddingLeft: 16, paddingRight: 16, maxWidth: 340, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
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

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.string };
