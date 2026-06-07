import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { getDataGridSx } from '../utils/dataGridStyles';
import { withFlexColumns } from '../utils/gridColumns';
import { normalizeRowSelectionModel } from '../utils/gridSelection';
import NoRowsOverlay from './NoRowsOverlay';

const DEFAULT_PAGE_SIZES = [10, 25, 50];

export default function DataGridTable({
  rows = [],
  columns,
  emptyMessage = 'No records found',
  checkboxSelection = false,
  pageSize = 25,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  minHeight = 380,
  maxHeight = 640,
  sx,
  initialState,
  slots,
  rowSelectionModel,
  onRowSelectionModelChange,
  ...props
}) {
  const theme = useTheme();
  const rowCount = rows.length;
  const normalizedColumns = useMemo(() => withFlexColumns(columns), [columns]);

  const height = useMemo(() => {
    if (rowCount === 0) return minHeight;
    const contentHeight = rowCount * 52 + 116;
    return Math.min(Math.max(contentHeight, 280), maxHeight);
  }, [rowCount, minHeight, maxHeight]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={normalizedColumns}
        rowHeight={52}
        columnHeaderHeight={48}
        showColumnVerticalBorder={false}
        disableColumnMenu
        autosizeOnMount
        autosizeOptions={{
          includeHeaders: true,
          expand: true,
        }}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        pageSizeOptions={pageSizeOptions}
        rowSelectionModel={checkboxSelection ? normalizeRowSelectionModel(rowSelectionModel) : undefined}
        onRowSelectionModelChange={onRowSelectionModelChange}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize } },
          ...initialState,
        }}
        slots={{
          noRowsOverlay: () => <NoRowsOverlay message={emptyMessage} />,
          ...slots,
        }}
        sx={{ ...getDataGridSx(theme), height, ...sx }}
        {...props}
      />
    </Box>
  );
}
