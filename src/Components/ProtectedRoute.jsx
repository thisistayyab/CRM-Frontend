import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MIUILoader from './MIUILoader';
import { checkSession } from '../utils/auth';
import { PRODUCT_NAME } from '../constants/brand';

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let active = true;

    checkSession().then((ok) => {
      if (active) setStatus(ok ? 'authenticated' : 'unauthenticated');
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
          <MIUILoader size={42} message="Loading your workspace..." />
        </Box>
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
