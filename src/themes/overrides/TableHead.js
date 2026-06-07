// ==============================|| OVERRIDES - TABLE HEAD ||============================== //

export default function TableHead(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : theme.palette.grey[50],
          borderTop: '1px solid',
          borderTopColor: theme.palette.divider,
          borderBottom: '2px solid',
          borderBottomColor: theme.palette.divider,
          '& .MuiTableCell-head': {
            color: isDark ? theme.palette.text.primary : theme.palette.text.primary,
            backgroundColor: 'inherit'
          }
        }
      }
    }
  };
}
