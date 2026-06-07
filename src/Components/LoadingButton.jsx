import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingButton({
  loading = false,
  children,
  disabled,
  startIcon,
  ...props
}) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      loading={loading}
      loadingIndicator={<CircularProgress size={18} color="inherit" thickness={5} />}
      startIcon={!loading ? startIcon : undefined}
    >
      {children}
    </Button>
  );
}
