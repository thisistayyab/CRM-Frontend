// Shared MUI DataGrid styling — dark/light safe, no broken filler separators

export function getDataGridSx(theme) {
  const isDark = theme.palette.mode === 'dark';
  const headerBg = isDark ? theme.palette.background.neutral : theme.palette.background.default;

  return {
    border: 'none',
    borderRadius: 0,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    fontFamily: 'Urbanist, sans-serif',
    '& .MuiDataGrid-main': {
      borderRadius: 0,
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: headerBg,
      borderBottom: `1px solid ${theme.palette.divider}`,
      minHeight: '48px !important',
      maxHeight: '48px !important',
    },
    '& .MuiDataGrid-columnHeader': {
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: '0.02em',
      color: theme.palette.text.secondary,
      px: 2,
      '&:focus, &:focus-within': { outline: 'none' },
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
    },
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller': {
      backgroundColor: headerBg,
    },
    '& .MuiDataGrid-cell': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      px: 2,
      '&:focus, &:focus-within': { outline: 'none' },
    },
    '& .MuiDataGrid-filler': {
      flex: '1 1 auto',
    },
    '& .MuiDataGrid-row': {
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.Mui-selected, &.Mui-selected:hover': {
        backgroundColor: theme.palette.action.selected,
      },
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: headerBg,
      borderTop: `1px solid ${theme.palette.divider}`,
      minHeight: 52,
    },
    '& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      color: theme.palette.text.secondary,
    },
    '& .MuiCheckbox-root': {
      color: theme.palette.text.secondary,
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiDataGrid-overlayWrapper': {
      minHeight: 240,
    },
    '& .MuiDataGrid-overlayWrapperInner': {
      height: '100% !important',
    },
    '& .MuiDataGrid-virtualScroller': {
      '&::-webkit-scrollbar': {
        width: 8,
        height: 8,
        backgroundColor: isDark ? theme.palette.background.neutral : '#f5f5f5',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: isDark ? '#475569' : '#c1c1c1',
        borderRadius: 4,
      },
    },
  };
}

export { getPageShellSx } from './pageStyles';

export function getPageToolbarSx() {
  return {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: { sm: 'center' },
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
  };
}

export function getPageToolbarFieldSx() {
  return {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
  };
}

export function getPageToolbarButtonSx() {
  return {
    flexShrink: 0,
    width: { xs: '100%', sm: 'auto' },
  };
}

export function getDataGridContainerSx(theme) {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    overflow: 'hidden',
  };
}
