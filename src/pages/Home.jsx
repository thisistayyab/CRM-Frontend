import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../assets/Stylesheets/Sidebar.css";
import Navbar from "../Components/Navbar";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      // await fetch("http://localhost:8000/v1/api/user/logout", {
      await fetch("https://crm-backend-rho-weld.vercel.app/v1/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error){
        console.log(error)
    }
    navigate("/login-signup");
  };

  const menuIconClass = isOpen ? "bx bx-menu-alt-right" : "bx bx-menu";

  return (
    <>
      <Navbar />
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-details">
          <i className="bx bxl-c-plus-plus icon"></i>
          <div className="logo_name">CRM</div>
          <i className={menuIconClass} id="btn" onClick={toggleSidebar}></i>
        </div>
        <ul className="nav-list">
          <li>
            <i className="bx bx-search" onClick={toggleSidebar}></i>
            <input type="text" placeholder="Search..." />
            <span className="tooltip">Search</span>
          </li>
          <li><Link to="/"><i className="bx bx-grid-alt"></i><span className="links_name">Dashboard</span></Link><span className="tooltip">Dashboard</span></li>
          <li><Link to="/user"><i className="bx bx-user"></i><span className="links_name">User</span></Link><span className="tooltip">User</span></li>
          <li><Link to="/products"><i className="bx bx-shopping-bag"></i><span className="links_name">Products</span></Link><span className="tooltip">products</span></li>
          <li><Link to="/analytics"><i className="bx bx-pie-chart-alt-2"></i><span className="links_name">Analytics</span></Link><span className="tooltip">Analytics</span></li>
          <li><Link to="/orders"><i className="bx bx-cart-alt"></i><span className="links_name">Order</span></Link><span className="tooltip">Order</span></li>
          <li><Link to="/settings"><i className="bx bx-cog"></i><span className="links_name">Setting</span></Link><span className="tooltip">Setting</span></li>
          <li className="profile">
            <div className="profile-details">
              <img src="https://drive.google.com/uc?export=view&id=1ETZYgPpWbbBtpJnhi42_IR3vOwSOpR4z" alt="profileImg" />
              <div className="name_job">
                <div className="name">Stella Army</div>
                <div className="job">Web designer</div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out" onClick={handleLogout}></i>
          </li>
        </ul>
      </div>

      <section className="home-section">
        <Outlet />
      </section>
    </>
  );
};

export default Home;
