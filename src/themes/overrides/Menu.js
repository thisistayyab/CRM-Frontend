// ==============================|| OVERRIDES - MENU ||============================== //

export default function Menu(theme) {
  return {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.customShadows?.z1 || theme.shadows[4]
        },
        list: {
          color: theme.palette.text.primary
        }
      }
    }
  };
} 