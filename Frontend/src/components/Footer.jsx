import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
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
              <li><a href="#" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-light text-decoration-none">Our Mission</a></li>
              <li><a href="#" className="text-light text-decoration-none">Get Involved</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-bold">Contact Us</h5>
            <p className="mb-1">
              <FontAwesomeIcon icon={faEnvelope} className="me-2 text-warning" /> hello@reallygreatsite.com
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="me-2 text-warning" /> (123) 456-7890
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
