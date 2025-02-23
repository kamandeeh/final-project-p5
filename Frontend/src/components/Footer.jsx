import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="py-5 text-white" style={{ backgroundColor: "#34495e" }}>
      <div className="container">
        <div className="row text-center text-md-start">
          
         
          {/* Middle Section */}
          <div className="col-md-4 mb-4 text-center">
            <h2 className="fw-bold">Get <span className="text-warning">in touch</span></h2>
            <p className="text-light">Have questions? Reach out and let's create change together.</p>
          </div>

          {/* Right Section */}
          <div className="col-md-4 text-center text-md-end">
            <div className="mb-3">
              <h3 className="fw-semibold">Follow Us</h3>
              <div className="d-flex justify-content-center justify-content-md-end gap-3 mt-2">
                <a href="#" className="text-white fs-4 text-decoration-none">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white fs-4 text-decoration-none">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white fs-4 text-decoration-none">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className="mb-3">
              <h3 className="fw-semibold">Email</h3>
              <p className="text-light">hello@reallygreatsite.com</p>
            </div>
            <div>
              <h3 className="fw-semibold">Phone</h3>
              <p className="text-light">(123) 456-7890</p>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-top mt-4 pt-3 text-center text-light small">
          © {new Date().getFullYear()} BLAH Company. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
