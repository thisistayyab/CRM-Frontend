import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const API_URL = "http://localhost:8000/v1/api/user";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user";

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/get-user`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (res.status === 401) {
          // Try to refresh the token
          try {
            const refreshRes = await fetch(`${API_URL}/refresh-token`, {
              method: 'POST',
              credentials: 'include',
            });
            
            if (refreshRes.ok) {
              // Token refreshed successfully, try get-user again
              const retryRes = await fetch(`${API_URL}/get-user`, {
                method: 'GET',
                credentials: 'include',
              });
              
              if (retryRes.status !== 200) {
                navigate('/login-signup');
              }
            } else {
              navigate('/login-signup');
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            navigate('/login-signup');
          }
        } else if (res.status !== 200) {
          navigate('/login-signup');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login-signup');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [navigate]);

  if (checking) return null; // or a loading spinner

  return children;
};

export default ProtectedRoute; 