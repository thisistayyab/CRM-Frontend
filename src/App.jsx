import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Products from './pages/Products';
import AddProduct from './Components/AddProduct';
import Order from './pages/Order';
import CreateOrder from './Components/CreateOrder';
import Setting from './pages/Setting';
import EditProfile from './Components/EditProfile';
import ProtectedRoute from './Components/ProtectedRoute';
import Analytics from './pages/Analytics';
import EditOrder from './Components/EditOrder';
import ViewOrder from './Components/ViewOrder';
import CustomerOrders from './pages/CustomerOrders';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
          <Route path="editorder/:id" element={<EditOrder />} />
          <Route path="order/:id" element={<ViewOrder />} />
          <Route path="vieworder/:id" element={<ViewOrder />} />
          <Route path="settings" element={<Setting />} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="customer-orders/:phoneNumber" element={<CustomerOrders />} />
        </Route>
        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
