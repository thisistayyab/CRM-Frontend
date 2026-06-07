import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export default function NoRowsOverlay({ message = 'No records found' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 240,
        gap: 1.5,
        py: 4,
        px: 2,
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 48, opacity: 0.5, color: 'text.disabled' }} />
      <Typography variant="body1" fontWeight={500} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
