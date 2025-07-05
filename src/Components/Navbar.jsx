import React, { useState, useEffect } from 'react';
import '../assets/Stylesheets/Navbar.css'; 
import { Link, useNavigate } from "react-router-dom"; 
import avatar from '../assets/images/users/avatar.jpg'

// const API_URL = "http://localhost:8000/v1/api/user";
const API_URL = "https://crm-backend-rho-weld.vercel.app/v1/api/user";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(avatar);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
  const fetchProfilePic = async () => {
    try {
      const res = await fetch(`${API_URL}/get-user`, {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      const profileUrl = result.data?.profilepic;

      if (profileUrl) {
        setProfilePic(profileUrl);
      }
    } catch (err) {
      console.error("Error fetching profile pic:", err.message);
    }
  };

  fetchProfilePic();
}, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/v1/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error){
      console.log(error)
    }
    navigate("/login-signup");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div></div> {/* Placeholder for center alignment */}
        <div className="profile-section">
          <img
            src={profilePic}
            alt="Profile"
            className="profile-pic"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="dropdown">
              <ul>
                <Link to="/settings">
                  <li>Settings</li>
                </Link>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
