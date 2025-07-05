import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/Stylesheets/form.css';

// const API_URL = "http://localhost:8000/v1/api/user"
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user"

const Login_Signup = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ fullname: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
    setError('');
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
    setError('');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loginPayload = {
        email: loginData.email,
        username: loginData.email, // Send email as username as well
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
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.log(err);
      setError('Login failed');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        setIsRightPanelActive(false);
        setError('Signup successful! Please login.');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.log(err);
      setError('Signup failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`container${!isMobile && isRightPanelActive ? ' right-panel-active' : ''}`} id="container">
        {/* Sign Up */}
        {(!isMobile || isRightPanelActive) && (
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignupSubmit}>
              <h1>Create Account</h1>
              <div className="social-container">
                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span>or use your email for registration</span>
              <input type="text" name="fullname" placeholder="Full Name" value={signupData.fullname} onChange={handleSignupChange} required />
              <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} required />
              <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required />
              <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required />
              <button type="submit">Sign Up</button>
              {isMobile && (
                <p style={{ marginTop: '20px' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={handleSignInClick} style={{ background: 'none', border: 'none', color: '#FF4B2B', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sign In
                  </button>
                </p>
              )}
            </form>
          </div>
        )}

        {/* Sign In */}
        {(!isMobile || !isRightPanelActive) && (
          <div className="form-container sign-in-container">
            <form onSubmit={handleLoginSubmit}>
              <h1>Sign in</h1>
              <div className="social-container">
                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <span>or use your account</span>
              <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
              <a href="#">Forgot your password?</a>
              <button type="submit">Sign In</button>
              {isMobile && (
                <p style={{ marginTop: '20px' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={handleSignUpClick} style={{ background: 'none', border: 'none', color: '#FF4B2B', fontWeight: 'bold', cursor: 'pointer' }}>
                    Sign Up
                  </button>
                </p>
              )}
            </form>
          </div>
        )}

        {/* Overlay */}
        {!isMobile && (
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button className="ghost" onClick={handleSignInClick}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default Login_Signup;
