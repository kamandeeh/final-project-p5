import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Import X (Twitter) icon
import "./Footer.css"; // Ensure this CSS file exists

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-container text-center">
          <Col md={4}>
            <h5 className="footer-logo">BLAH Foundation</h5>
            <p>Empowering communities through education, healthcare, and social integration.</p>
          </Col>
          <Col md={4}>
            <ul className="footer-links">
              <li><a href="/get-involved">Get Involved</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BLAH Foundation. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
