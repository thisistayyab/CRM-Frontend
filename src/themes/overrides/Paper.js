import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
        elevation1: {
          boxShadow: isDark ? 'none' : `0 1px 2px ${alpha('#0F172A', 0.05)}`,
        },
        elevation2: {
          boxShadow: isDark ? `0 1px 4px ${alpha('#000', 0.2)}` : `0 2px 6px ${alpha('#0F172A', 0.06)}`,
        },
        elevation3: {
          boxShadow: isDark ? `0 2px 8px ${alpha('#000', 0.25)}` : `0 2px 8px ${alpha('#0F172A', 0.07)}`,
        },
      },
    },
  };
}
