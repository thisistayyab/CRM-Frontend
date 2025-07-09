import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Stylesheets/form.css';
import MIUIAlert from '../Components/MIUIAlert';
import { api } from '../server';

// const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user";
// const API_URL = "http://localhost:8000/v1/api/user";
const API_URL = `${api}/v1/api/user`;

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [alert, setAlert] = useState({ open: false, type: 'error', message: '' });
  const [alertKey, setAlertKey] = useState(0);
  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert((a) => ({ ...a, open: false }));
  };
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlert({ open: false, type: 'error', message: '' });
    try {
      const loginPayload = {
        email: loginData.email,
        username: loginData.email,
        password: loginData.password
      };
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.data && data.data.accessToken) {
        navigate('/');
      } else {
        if (res.status === 401 || res.status === 403) {
          setAlert({ open: true, type: 'error', message: 'Wrong credentials' });
        } else {
          setAlert({ open: true, type: 'error', message: 'Login failed' });
        }
        setAlertKey((k) => k + 1);
      }
    } catch (err) {
      console.log(err);
      setAlert({ open: true, type: 'error', message: 'Login failed' });
      setAlertKey((k) => k + 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <MIUIAlert
        open={alert.open}
        type={alert.type}
        message={alert.message}
        onClose={handleAlertClose}
        alertKey={alertKey}
      />
      <form onSubmit={handleLoginSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320, maxWidth: 360, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign In</h2>
        <div style={{ marginBottom: 16 }}>
          <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, background: '#FF4B2B', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }}>Sign In</button>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <a href="/signup" style={{ color: '#FF4B2B', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 