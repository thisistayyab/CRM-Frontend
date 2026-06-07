import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - CARD ||============================== //

export default function Card(theme) {
  const isDark = theme.palette.mode === 'dark';
  const softShadow = isDark
    ? 'none'
    : `0 1px 2px ${alpha('#0F172A', 0.04)}`;

  return {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: softShadow,
        },
      },
    },
  };
}
