import React, { useState } from 'react';
import {
  Box,
  Button,
  Card as MuiCard,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useNavigate } from 'react-router-dom';
import MIUIAlert from '../../MIUIAlert';
import { api } from '../../../server';

const API_URL = `${api}/v1/api/user`;

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles?.('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignupCard() {
  const [signupData, setSignupData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const navigate = useNavigate();

  const handleAlertClose = (_, reason) => {
    if (reason !== 'clickaway') setAlert((a) => ({ ...a, open: false }));
  };

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!signupData.fullname.trim()) newErrors.fullname = 'Full name is required.';
    if (!signupData.username.trim()) newErrors.username = 'Username is required.';
    if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Enter a valid email.';
    if (!signupData.password || signupData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ open: false, type: 'error', message: '' });

    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ open: true, type: 'success', message: 'Signup successful! Please login.' });
        setAlertKey((k) => k + 1);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setAlert({ open: true, type: 'error', message: data.message || 'Signup failed' });
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      console.log(err);
      setAlert({ open: true, type: 'error', message: 'Signup failed' });
      setAlertKey((k) => k + 1);
    }
  };

  return (
    <>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />

      <Card variant="outlined">
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <SitemarkIcon />
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="fullname">Full Name</FormLabel>
            <TextField
              id="fullname"
              name="fullname"
              value={signupData.fullname}
              onChange={handleChange}
              error={!!errors.fullname}
              helperText={errors.fullname}
              placeholder="John Doe"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              id="username"
              name="username"
              value={signupData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              placeholder="john123"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              name="email"
              type="email"
              value={signupData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="your@email.com"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              value={signupData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="••••••"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign up
          </Button>

          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>

        <Divider>or</Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
            Sign up with Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
            Sign up with Facebook
          </Button>
        </Box>
      </Card>
    </>
  );
}
