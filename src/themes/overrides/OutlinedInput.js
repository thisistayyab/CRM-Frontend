// project imports
import getColors from '../utils/getColors';
import getShadow from '../utils/getShadow';

// ==============================|| OVERRIDES - INPUT BORDER & SHADOWS ||============================== //

function getColor({ variant, theme }) {
  const colors = getColors(theme, variant);
  const { light } = colors;

  const shadows = getShadow(theme, `${variant}`);

  return {
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: light },
    '&.Mui-focused': { boxShadow: shadows, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: light } }
  };
}

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '10.5px 14px 10.5px 12px',
          color: theme.palette.text.primary,
          '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.85
          },
          '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled
          }
        },
        notchedOutline: {
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : theme.palette.grey[300]
        },
        root: {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.35)'
            : theme.palette.background.paper,
          ...getColor({ variant: 'primary', theme }),
          '&.Mui-error': { ...getColor({ variant: 'error', theme }) },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider
            }
          }
        },
        inputSizeSmall: { padding: '7.5px 8px 7.5px 12px' },
        inputMultiline: { padding: 0 },
        colorSecondary: getColor({ variant: 'secondary', theme }),
        colorError: getColor({ variant: 'error', theme }),
        colorWarning: getColor({ variant: 'warning', theme }),
        colorInfo: getColor({ variant: 'info', theme }),
        colorSuccess: getColor({ variant: 'success', theme })
      }
    }
  };
}
