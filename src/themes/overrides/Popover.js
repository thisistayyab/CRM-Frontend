// ==============================|| OVERRIDES - POPOVER ||============================== //

export default function Popover(theme) {
  return {
    MuiPopover: {
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
