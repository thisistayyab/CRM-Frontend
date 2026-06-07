// ==============================|| OVERRIDES - TABLE BODY ||============================== //

export default function TableBody(theme) {
  const isDark = theme.palette.mode === 'dark';

  const hoverStyle = {
    '&:hover': {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : theme.palette.secondary.lighter
    }
  };

  return {
    MuiTableBody: {
      styleOverrides: {
        root: {
          '&.striped .MuiTableRow-root': {
            '&:nth-of-type(even)': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : theme.palette.grey[50]
            },
            ...hoverStyle
          },
          '& .MuiTableRow-root': {
            ...hoverStyle
          }
        }
      }
    }
  };
}
