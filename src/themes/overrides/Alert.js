// ==============================|| OVERRIDES - ALERT ||============================== //

export default function Alert(theme) {
  return {
    MuiAlert: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary
        },
        message: {
          color: 'inherit'
        }
      }
    }
  };
}
