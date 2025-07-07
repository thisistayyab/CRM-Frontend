import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Stylesheets/form.css';

const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user"
// const API_URL = "http://localhost:8000/v1/api/user"

const Signup = () => {
  const [signupData, setSignupData] = useState({ fullname: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Signup successful! Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.log(err);
      setError('Signup failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <form onSubmit={handleSignupSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320, maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
        <div style={{ marginBottom: 16 }}>
          <input type="text" name="fullname" placeholder="Full Name" value={signupData.fullname} onChange={handleSignupChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required style={{ width: '100%', padding: 10, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, background: '#FF4B2B', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }}>Sign Up</button>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <span>Already have an account? </span>
          <a href="/login" style={{ color: '#FF4B2B', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>Sign In</a>
        </div>
        {success && <div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>{success}</div>}
        {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{error}</div>}
      </form>
    </div>
  );
};

export default Signup; 