// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
  return {
    MuiCard: {
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
