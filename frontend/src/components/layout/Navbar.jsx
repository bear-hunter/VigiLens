import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// Add FiUpload back to the import
import { FiCamera, FiHome, FiVideo, FiUpload } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="navbar-logo">
          <FiCamera />
        </div>
        <h1 className="navbar-title">Dashboard</h1>
      </div>

      <ul className="nav-list">
        <li>
          <NavLink to="/" className="nav-link" end>
            <FiHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/review" className="nav-link">
            <FiVideo className="nav-icon" />
            <span className="nav-text">Incident Review</span>
          </NavLink>
        </li>
        {/* --- ADD THIS LIST ITEM BACK --- */}
      </ul>
    </nav>
  );
};

export default Navbar;