// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select(theme) {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          color: theme.palette.text.primary,
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled
          }
        },
        icon: {
          color: theme.palette.text.secondary
        }
      }
    }
  };
}
