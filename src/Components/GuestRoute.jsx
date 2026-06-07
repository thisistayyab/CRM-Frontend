import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MIUILoader from './MIUILoader';
import { checkSession } from '../utils/auth';
import { PRODUCT_NAME } from '../constants/brand';

/** Redirects authenticated users away from login/signup pages. */
const GuestRoute = ({ children }) => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    checkSession().then((ok) => {
      if (active) setStatus(ok ? 'authenticated' : 'guest');
    });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          px: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            {PRODUCT_NAME}
          </Typography>
          <MIUILoader size={42} message="Checking session..." />
        </Box>
      </Box>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;
