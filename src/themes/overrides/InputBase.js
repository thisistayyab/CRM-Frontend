// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary
        },
        input: {
          color: theme.palette.text.primary,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.85
          }
        }
      }
    }
  };
}
