import { alpha } from '@mui/material/styles';

/** Shared page shell — full width with responsive padding */
export function getPageShellSx(extra = {}) {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    px: { xs: 2, sm: 3 },
    py: 3,
    overflow: 'hidden',
    ...extra,
  };
}

/** Border-first surface card — subtle shadow in light mode, none in dark */
export function getSurfaceCardSx(theme) {
  const isDark = theme.palette.mode === 'dark';
  return {
    borderRadius: 2.5,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: 'background.paper',
    color: 'text.primary',
    boxShadow: isDark ? 'none' : `0 1px 2px ${alpha('#0F172A', 0.04)}`,
    backgroundImage: 'none',
  };
}

export function getCardHeaderSx() {
  return {
    px: { xs: 2, sm: 3 },
    py: 2,
    borderBottom: 1,
    borderColor: 'divider',
    '& .MuiCardHeader-action': { alignSelf: 'center', m: 0 },
  };
}

export function getCardContentSx() {
  return {
    px: { xs: 2, sm: 3 },
    pt: { xs: 2.5, sm: 3 },
    pb: { xs: 2.5, sm: 3 },
    '&:last-child': { pb: { xs: 2.5, sm: 3 } },
  };
}

export function getFormFieldSx() {
  return { '& .MuiFormLabel-root': { fontSize: '0.875rem' } };
}

const AVATAR_COLORS = new Set(['primary', 'secondary', 'error', 'warning', 'info', 'success']);

/** Tinted icon container — icon color contrasts with background in dark & light mode */
export function getTintedAvatarSx(theme, color = 'primary', size = 42) {
  const key = AVATAR_COLORS.has(color) ? color : 'primary';
  const isDark = theme.palette.mode === 'dark';
  return {
    width: size,
    height: size,
    borderRadius: 2,
    bgcolor: alpha(theme.palette[key].main, isDark ? 0.2 : 0.12),
    color: theme.palette[key].main,
  };
}
