import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone, faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  const { user } = useUser(); // Get user context

  return (
    <footer className="bg-dark text-white py-5" style={{ backgroundColor: "#34495e" }}>
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Company Info */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">BLAH Company</h4>
            <p className="text-light">Join us in advocating for the rights of refugees and making a difference.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/aboutus" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="/our-mission" className="text-light text-decoration-none">Our Mission</Link></li>
              <li><Link to="/get-involved" className="text-light text-decoration-none">Get Involved</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>


                <li>
                  <Link to="/admin/dashboard" className="text-warning text-decoration-none fw-bold">
                    <FontAwesomeIcon icon={faGaugeHigh} className="me-2" /> Admin Dashboard
                  </Link>
                </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-bold">Contact Us</h5>
            <p className="mb-1">
              <FontAwesomeIcon icon={faEnvelope} className="me-2 text-warning" /> blahfoundation@gmail.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="me-2 text-warning" /> +254 768 323 735
            </p>

            {/* Social Icons */}
            <div className="mt-3">
              <a href="#" className="text-light me-3 fs-4">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-light me-3 fs-4">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-light me-3 fs-4">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-light fs-4">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-4 border-top pt-3">
          <p className="mb-0 text-light">&copy; {new Date().getFullYear()} BLAH Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
