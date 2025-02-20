import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/usercontext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [whoWeAreDropdown, setWhoWeAreDropdown] = useState(false);
  const [getInvolvedDropdown, setGetInvolvedDropdown] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">BLAH Foundation</h1>
        <ul className="flex space-x-6 relative">
          <li><Link className="hover:text-gray-400" to="/">Home</Link></li>

          {/* Who We Are Dropdown */}
          <li className="relative"
            onMouseEnter={() => setWhoWeAreDropdown(true)}
            onMouseLeave={() => setWhoWeAreDropdown(false)}>
            <span className="cursor-pointer">Who We Are ▼</span>
            {whoWeAreDropdown && (
              <ul className="absolute left-0 mt-2 bg-gray-700 text-white shadow-lg rounded w-52">
                <li><Link className="block px-4 py-2 hover:bg-gray-600" to="/aboutus">About Us</Link></li>
                <li><Link className="block px-4 py-2 hover:bg-gray-600" to="/management-team">Management Team</Link></li>
              </ul>
            )}
          </li>

          {/* Get Involved Dropdown */}
          <li className="relative"
            onMouseEnter={() => setGetInvolvedDropdown(true)}
            onMouseLeave={() => setGetInvolvedDropdown(false)}>
            <span className="cursor-pointer">Get Involved ▼</span>
            {getInvolvedDropdown && (
              <ul className="absolute left-0 mt-2 bg-gray-700 text-white shadow-lg rounded w-52">
                <li><Link className="block px-4 py-2 hover:bg-gray-600" to="/records">Records</Link></li>
                <li><Link className="block px-4 py-2 hover:bg-gray-600" to="/donate">Donate</Link></li>
              </ul>
            )}
          </li>

          <li><Link className="hover:text-gray-400" to="/contact">Contact Us</Link></li>
          {user ? (
            <li><Link className="hover:text-gray-400" to="/profile">Profile</Link></li>
          ) : (
            <li><Link className="hover:text-gray-400" to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;