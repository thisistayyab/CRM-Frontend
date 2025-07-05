import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login_Signup from './pages/Login_Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Products from './pages/Products';
import AddProduct from './Components/AddProduct';
import Order from './pages/Order';
import CreateOrder from './Components/CreateOrder';
import Setting from './pages/Setting';
import './App.css';
import EditProfile from './Components/EditProfile';
import ProtectedRoute from './Components/ProtectedRoute';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login-signup" element={<Login_Signup />} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* Nested Pages */}
          <Route index element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="profile-edit" element={<EditProfile />} />
          <Route path="products" element={<Products />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="orders" element={<Order />} />
          <Route path="createorder" element={<CreateOrder />} />
          <Route path="settings" element={<Setting />} />
          <Route path="analytics" element={<Analytics/>} />
        </Route>
        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login-signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
