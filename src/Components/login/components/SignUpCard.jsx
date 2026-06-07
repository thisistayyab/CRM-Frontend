import React, { useState } from 'react';
import {
  Box,
  Card as MuiCard,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../../../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import MIUIAlert from '../../MIUIAlert';
import { api } from '../../../server';
import { useColorScheme } from '@mui/material/styles';
import VerificationCard from './VerificationCard';
import LoadingButton from '../../LoadingButton';
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
  ...theme.applyStyles?.('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function SignupCard() {
  const [signupData, setSignupData] = useState({
    fullname: '',
    storeName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [fullnameError, setFullnameError] = useState(false);
  const [fullnameErrorMessage, setFullnameErrorMessage] = useState('');
  const [storeNameError, setStoreNameError] = useState(false);
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const navigate = useNavigate();
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode || 'light' : mode || 'light';
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAlertClose = (_, reason) => {
    if (reason !== 'clickaway') setAlert((a) => ({ ...a, open: false }));
  };

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    switch (e.target.name) {
      case 'fullname':
        setFullnameError(false);
        setFullnameErrorMessage('');
        break;
      case 'storeName':
        setStoreNameError(false);
        setStoreNameErrorMessage('');
        break;
      case 'phone':
        setPhoneError(false);
        setPhoneErrorMessage('');
        break;
      case 'email':
        setEmailError(false);
        setEmailErrorMessage('');
        break;
      case 'password':
        setPasswordError(false);
        setPasswordErrorMessage('');
        break;
      default:
        break;
    }
  };

  const validate = () => {
    let isValid = true;
    if (!signupData.fullname.trim()) {
      setFullnameError(true);
      setFullnameErrorMessage('Your name is required.');
      isValid = false;
    } else {
      setFullnameError(false);
      setFullnameErrorMessage('');
    }
    if (!signupData.storeName.trim()) {
      setStoreNameError(true);
      setStoreNameErrorMessage('Store or business name is required.');
      isValid = false;
    } else {
      setStoreNameError(false);
      setStoreNameErrorMessage('');
    }
    const digits = signupData.phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setPhoneError(true);
      setPhoneErrorMessage('Enter a valid phone number (at least 10 digits).');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
    }
    if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!signupData.password || signupData.password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ open: false, type: 'error', message: '' });

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        setPendingVerification(true);
        setAlert({ open: true, type: 'success', message: data.message || 'Verification code sent. Please check your inbox.' });
        setAlertKey((k) => k + 1);
      } else {
        setAlert({ open: true, type: 'error', message: data.message || 'Signup failed' });
        setAlertKey((k) => k + 1);
      }
    } catch {
      setAlert({ open: true, type: 'error', message: 'Signup failed' });
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
      {pendingVerification ? (
        <VerificationCard email={signupData.email} password={signupData.password} />
      ) : (
      <Card variant="outlined">
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Box component="img" src={logo} alt={`${PRODUCT_NAME} logo`} sx={{ width: 40, height: 40, borderRadius: 2, mr: 1, background: 'background.default', p: 0.5, boxShadow: 1 }} />
                <Typography variant="h6" className="text-gradient" sx={{ fontWeight: 700, letterSpacing: 0, fontSize: 26 }}>
                  {PRODUCT_NAME}
                </Typography>
              </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(1.75rem, 4vw, 2.125rem)' }}
        >
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set up your seller profile — we use your email to sign in, not a username.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="fullname">Your full name</FormLabel>
            <TextField
              id="fullname"
              name="fullname"
              value={signupData.fullname}
              onChange={handleChange}
              error={fullnameError}
              helperText={fullnameErrorMessage}
              placeholder="Ali Khan"
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="storeName">Store / business name</FormLabel>
            <TextField
              id="storeName"
              name="storeName"
              value={signupData.storeName}
              onChange={handleChange}
              error={storeNameError}
              helperText={storeNameErrorMessage}
              placeholder="Khan Fashion House"
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="phone">Business phone</FormLabel>
            <TextField
              id="phone"
              name="phone"
              value={signupData.phone}
              onChange={handleChange}
              error={phoneError}
              helperText={phoneErrorMessage}
              placeholder="03XX XXXXXXX"
              inputProps={{ inputMode: 'tel' }}
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
              error={emailError}
              helperText={emailErrorMessage}
              placeholder="your@email.com"
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
              error={passwordError}
              helperText={passwordErrorMessage}
              placeholder="••••••"
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <LoadingButton type="submit" fullWidth variant="contained" color="primary" loading={submitting}>
            Sign up
          </LoadingButton>

          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" variant="body2">
              Sign in
            </Link>
          </Typography>
        </Box>

      </Card>
      )}
    </>
  );
}
