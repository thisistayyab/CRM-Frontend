// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const isDark = theme.palette.mode === 'dark';
  const disabledBg = isDark ? 'rgba(255, 255, 255, 0.08)' : theme.palette.grey[200];
  const disabledColor = theme.palette.text.disabled;

  const containedColor = (colorKey) => ({
    color: theme.palette[colorKey].contrastText,
    backgroundColor: theme.palette[colorKey].main,
    '&:hover': {
      backgroundColor: theme.palette[colorKey].dark,
    },
    '&.Mui-disabled': {
      backgroundColor: disabledBg,
      color: disabledColor,
    },
  });

  const outlinedColor = (colorKey) => ({
    color: theme.palette[colorKey].main,
    borderColor: isDark ? `${theme.palette[colorKey].main}55` : `${theme.palette[colorKey].main}99`,
    '&:hover': {
      backgroundColor: isDark ? `${theme.palette[colorKey].main}18` : `${theme.palette[colorKey].main}12`,
      borderColor: theme.palette[colorKey].main,
    },
    '&.Mui-disabled': {
      borderColor: theme.palette.divider,
      color: disabledColor,
    },
  });

  const textColor = (colorKey) => ({
    color: theme.palette[colorKey].main,
    '&:hover': {
      backgroundColor: isDark ? `${theme.palette[colorKey].main}18` : `${theme.palette[colorKey].main}10`,
    },
    '&.Mui-disabled': {
      color: disabledColor,
    },
  });

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          lineHeight: 1.4,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedInherit: {
          color: theme.palette.text.primary,
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : theme.palette.grey[300],
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.16)' : theme.palette.grey[400],
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
          },
        },
        outlinedInherit: {
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.divider,
          },
        },
        textInherit: {
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
        },
        containedPrimary: containedColor('primary'),
        containedSecondary: containedColor('secondary'),
        containedError: containedColor('error'),
        containedSuccess: containedColor('success'),
        containedInfo: containedColor('info'),
        containedWarning: containedColor('warning'),
        outlinedPrimary: outlinedColor('primary'),
        outlinedSecondary: outlinedColor('secondary'),
        outlinedError: outlinedColor('error'),
        outlinedSuccess: outlinedColor('success'),
        outlinedInfo: outlinedColor('info'),
        outlinedWarning: outlinedColor('warning'),
        textPrimary: textColor('primary'),
        textSecondary: textColor('secondary'),
        textError: textColor('error'),
        textSuccess: textColor('success'),
        textInfo: textColor('info'),
        textWarning: textColor('warning'),
        loading: {
          pointerEvents: 'none',
        },
      },
    },
  };
}
