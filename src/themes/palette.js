import { createTheme } from '@mui/material/styles';
import { brandColors, slateGrey } from '../constants/brandColors.js';

function softShadows(mode) {
  const rgb = mode === 'dark' ? '0, 0, 0' : '15, 23, 42';
  return Array.from({ length: 25 }, (_, i) => {
    if (i === 0) return 'none';
    const y = Math.min(i, 4);
    const blur = 4 + i * 2;
    const opacity = mode === 'dark' ? Math.min(0.12 + i * 0.02, 0.35) : Math.min(0.03 + i * 0.012, 0.1);
    return `0px ${y}px ${blur}px -${Math.floor(i / 2)}px rgba(${rgb}, ${opacity})`;
  });
}

export default function Palette(mode) {
  const tokens = mode === 'dark' ? brandColors.dark : brandColors.light;
  const secondaryMain = mode === 'dark' ? '#334155' : '#475569';
  const secondaryContrast = '#FFFFFF';

  return createTheme({
    shadows: softShadows(mode),
    palette: {
      mode,
      common: {
        black: '#000000',
        white: '#FFFFFF',
      },
      primary: {
        lighter: brandColors.primaryBright,
        light: tokens.primaryLight,
        main: tokens.primaryMain,
        dark: tokens.primaryDark,
        contrastText: tokens.primaryContrast,
      },
      secondary: {
        light: tokens.accent,
        main: secondaryMain,
        dark: mode === 'dark' ? '#1E293B' : '#334155',
        contrastText: secondaryContrast,
      },
      error: {
        light: '#FCA5A5',
        main: brandColors.destructive,
        dark: '#DC2626',
        contrastText: '#FFFFFF',
      },
      warning: {
        light: '#FDE68A',
        main: '#F59E0B',
        dark: '#D97706',
        contrastText: '#0F172A',
      },
      info: {
        light: brandColors.accentBlue,
        main: brandColors.primary,
        dark: tokens.primaryDark,
        contrastText: tokens.primaryContrast,
      },
      success: {
        light: '#6EE7B7',
        main: '#10B981',
        dark: '#059669',
        contrastText: '#FFFFFF',
      },
      grey: slateGrey,
      text: {
        primary: tokens.foreground,
        secondary: tokens.mutedForeground,
        disabled: mode === 'dark' ? '#64748B' : '#94A3B8',
      },
      divider: tokens.border,
      background: {
        paper: tokens.card,
        default: tokens.background,
        neutral: tokens.neutral,
      },
      action: mode === 'dark'
        ? {
            hover: 'rgba(34, 211, 238, 0.08)',
            selected: 'rgba(34, 211, 238, 0.16)',
            disabled: 'rgba(148, 163, 184, 0.5)',
            disabledBackground: 'rgba(51, 65, 85, 0.5)',
            focus: 'rgba(34, 211, 238, 0.24)',
          }
        : {
            hover: 'rgba(8, 145, 178, 0.06)',
            selected: 'rgba(8, 145, 178, 0.12)',
            disabled: slateGrey[400],
            disabledBackground: slateGrey[200],
            focus: 'rgba(8, 145, 178, 0.2)',
          },
    },
    shape: {
      borderRadius: 10,
    },
  });
}
