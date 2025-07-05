import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000/v1/api/user";

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
        if (res.status !== 200) {
          navigate('/login-signup');
        }
      } catch {
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