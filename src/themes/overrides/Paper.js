// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }
      }
    }
  };
}
