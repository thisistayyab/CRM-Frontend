import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function MIUILoader({ size = 48, message = '' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', width: '100%' }}>
      {/* SVG gradient definition */}
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="miui_loader_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        size={size}
        sx={{ 'svg circle': { stroke: 'url(#miui_loader_gradient)' } }}
      />
      {message && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>{message}</Typography>
      )}
    </Box>
  );
} 