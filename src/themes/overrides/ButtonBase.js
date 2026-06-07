// ==============================|| OVERRIDES - BUTTON BASE ||============================== //

export default function ButtonBase(theme) {
  return {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            opacity: 0.55,
          },
        },
      },
    },
  };
}
