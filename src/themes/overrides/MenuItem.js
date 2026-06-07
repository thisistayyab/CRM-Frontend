// ==============================|| OVERRIDES - MENU ITEM ||============================== //

export default function MenuItem(theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.text.primary,
            '&:hover': {
              backgroundColor: theme.palette.action.selected
            }
          },
          '&.Mui-focusVisible': {
            backgroundColor: theme.palette.action.hover
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            opacity: 1
          }
        }
      }
    }
  };
}
