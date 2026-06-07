import React, { useState } from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '../../LoadingButton';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPasswordCard from './ForgotPasswordCard';
import logo from '../../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import MIUIAlert from '../../MIUIAlert';
import { api } from '../../../server';
import { useColorScheme } from '@mui/material/styles';
import { PRODUCT_NAME } from '../../../constants/brand';

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
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };
  const navigate = useNavigate();
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode || 'light' : mode || 'light';

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let isValid = true;

    if (!loginData.email || !/\S+@\S+\.\S+/.test(loginData.email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!loginData.password || loginData.password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setAlert({ open: false, type: 'error', message: '' });
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.data && data.data.accessToken) {
        navigate('/', { replace: true });
      } else if (res.status === 401 || res.status === 403) {
        setAlert({ open: true, type: 'error', message: 'Wrong credentials' });
        setAlertKey((k) => k + 1);
      } else if (data.message?.toLowerCase().includes('user not found')) {
        setAlert({ open: true, type: 'error', message: 'User not found' });
        setAlertKey((k) => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: data.message || 'Login failed' });
        setAlertKey((k) => k + 1);
      }
    } catch {
      setAlert({ open: true, type: 'error', message: 'Login failed' });
      setAlertKey((k) => k + 1);
    } finally {
      setSubmitting(false);
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
        mode={resolvedMode}
      />
      {showForgot ? (
        <ForgotPasswordCard onSuccess={() => setShowForgot(false)} />
      ) : (
        <Card variant="outlined">
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Box component="img" src={logo} alt={`${PRODUCT_NAME} logo`} sx={{ width: 40, height: 40, borderRadius: 2, mr: 1, background: 'background.default', p: 0.5, boxShadow: 1 }} />
                <Typography variant="h6" className="text-gradient" sx={{ fontWeight: 700, letterSpacing: 0, fontSize: 26 }}>
              {PRODUCT_NAME}
            </Typography>
          </Box>
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLoginSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={() => setShowForgot(true)}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <LoadingButton type="submit" fullWidth variant="contained" color="primary" loading={submitting}>
              Sign in
            </LoadingButton>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      )}
    </>
  );
}
