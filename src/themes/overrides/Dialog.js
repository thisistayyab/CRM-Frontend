// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          backgroundImage: 'none'
        }
      }
    }
  };
}
