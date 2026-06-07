// ==============================|| OVERRIDES - FORM HELPER TEXT ||============================== //

export default function FormHelperText(theme) {
  return {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 4,
          marginLeft: 0,
          color: theme.palette.text.secondary
        }
      }
    }
  };
}
