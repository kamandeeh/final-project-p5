import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext"; // Import UserContext
import "../components/Navbar.css";

const Navbar = () => {
  const { user, logout } = useUser();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">BLAH Foundation</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          {/* Who We Are Dropdown */}
          <li className="dropdown">
            <button className="dropdown-toggle" onClick={() => setOpenDropdown(openDropdown === "whoWeAre" ? null : "whoWeAre")}>
              Who We Are
            </button>
            <ul className={`dropdown-menu ${openDropdown === "whoWeAre" ? "show" : ""}`}>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/management-team">Management Team</Link></li>
            </ul>
          </li>

          <li><Link to="/records">Records</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>

        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Sign Up</Link>
            </>
          ) : (
            <button className="btn" onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
