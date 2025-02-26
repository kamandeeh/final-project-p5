import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faRightFromBracket, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css"; // Ensure styling is properly linked

const Navbar = () => {
  const { user, logout } = useUser();
  const [whoWeAreDropdown, setWhoWeAreDropdown] = useState(false);
  const [getInvolvedDropdown, setGetInvolvedDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu on link click (better UX)
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 py-3 shadow">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand fs-3 fw-bold text-white">
          BLAH Foundation
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/" onClick={handleLinkClick}>
                <FontAwesomeIcon icon={faHouse} /> Home
              </Link>
            </li>

            {/* Who We Are Dropdown (Hidden Button) */}
            <li className="nav-item dropdown">
              <span
                className="nav-link text-white fw-semibold dropdown-toggle"
                onClick={() => setWhoWeAreDropdown(!whoWeAreDropdown)}
                style={{ cursor: "pointer" }}
              >
                Who We Are <FontAwesomeIcon icon={faAngleDown} />
              </span>
              {whoWeAreDropdown && (
                <ul className="dropdown-menu show">
                  <li><Link className="dropdown-item" to="/aboutus" onClick={handleLinkClick}>About Us</Link></li>
                  <li><Link className="dropdown-item" to="/management-team" onClick={handleLinkClick}>Management Team</Link></li>
                </ul>
              )}
            </li>

            {/* Get Involved Dropdown (Hidden Button) */}
            <li className="nav-item dropdown">
              <span
                className="nav-link text-white fw-semibold dropdown-toggle"
                onClick={() => setGetInvolvedDropdown(!getInvolvedDropdown)}
                style={{ cursor: "pointer" }}
              >
                Get Involved <FontAwesomeIcon icon={faAngleDown} />
              </span>
              {getInvolvedDropdown && (
                <ul className="dropdown-menu show">
                  <li><Link className="dropdown-item" to="/records" onClick={handleLinkClick}>Records</Link></li>
                  <li><Link className="dropdown-item" to="/donate" onClick={handleLinkClick}>Donate</Link></li>
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold" to="/contact" onClick={handleLinkClick}>
                Contact Us
              </Link>
            </li>

            {/* Profile/Login */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold" to="/profile" onClick={handleLinkClick}>
                    <FontAwesomeIcon icon={faUser} /> Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger text-white fw-semibold ms-3" onClick={logout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold" to="/login" onClick={handleLinkClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold" to="/register" onClick={handleLinkClick}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
