// frontend/src/components/layout/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

// Import the necessary icons
import { FiCamera, FiHome, FiUpload } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="navbar-logo">
          <FiCamera />
        </div>
        {/* Changed title to VigiLens to be more descriptive */}
        <h1 className="navbar-title">VigiLens</h1>
      </div>

      <ul className="nav-list">
        <li>
          {/* Use 'end' prop to ensure this only matches the exact "/" path */}
          <NavLink to="/" className="nav-link" end>
            <FiHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>

        {/* --- ADDED THE UPLOAD LINK BACK --- */}
        <li>
          <NavLink to="/upload" className="nav-link">
            <FiUpload className="nav-icon" />
            <span className="nav-text">Upload Video</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
