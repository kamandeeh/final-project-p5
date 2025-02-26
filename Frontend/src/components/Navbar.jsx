import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"; 
import "./Navbar.css";
import { logout } from "../../firebase";

const Navbar = () => {
  const { user } = useUser();
  const [whoWeAreDropdown, setWhoWeAreDropdown] = useState(false);
  const [getInvolvedDropdown, setGetInvolvedDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <strong>BLAH</strong> Foundation
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      
        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} /> Home
            </Link>
          </li>

          {/* Who We Are Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setWhoWeAreDropdown(true)}
            onMouseLeave={() => setWhoWeAreDropdown(false)}
          >
            <span className="dropdown-toggle">Who We Are ▼</span>
            {whoWeAreDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/about-us">About Us</Link></li> {/* ✅ Fixed route */}
                <li><Link to="/management-team">Management Team</Link></li>
              </ul>
            )}
          </li>

          {/* Get Involved Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setGetInvolvedDropdown(true)}
            onMouseLeave={() => setGetInvolvedDropdown(false)}
          >
            <span className="dropdown-toggle">Get Involved ▼</span>
            {getInvolvedDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/records">Records</Link></li>
                <li><Link to="/donate">Donate</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/reviews">Reviews</Link></li> {/* ✅ Added Page */}
          <li><Link to="/contact">Contact Us</Link></li>

          {/* Profile/Login */}
          {user ? (
            <>
              <li>
                <Link to="/profile">
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li>
                <button className="logout-btn" onClick={logout}>
                  <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
