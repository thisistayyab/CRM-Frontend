import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from './LoadingButton';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = '',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
}) => (
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={confirmLoading ? undefined : onCancel}
    aria-describedby="confirm-dialog-description"
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
  >
    <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>{title}</DialogTitle>
    <DialogContent>
      <Typography id="confirm-dialog-description" sx={{ fontSize: 16, color: 'text.secondary', py: 1 }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ pb: 2, pr: 3 }}>
      <LoadingButton onClick={onCancel} color="inherit" disabled={confirmLoading} sx={{ fontWeight: 600, borderRadius: 2 }}>
        {cancelText}
      </LoadingButton>
      <LoadingButton
        onClick={onConfirm}
        color="primary"
        variant="contained"
        loading={confirmLoading}
        sx={{ fontWeight: 700, borderRadius: 2 }}
      >
        {confirmText}
      </LoadingButton>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
