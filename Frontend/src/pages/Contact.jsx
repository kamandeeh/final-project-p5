import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required!");
      return;
    }

    const token = localStorage.getItem("token"); // Get stored token

    if (!token) {
      setError("You are not authenticated! Please log in.");
      return;
    }

    setLoading(true); // Show loading state

    try {
      const response = await fetch("http://127.0.0.1:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Ensure the token is correctly formatted
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        setError(data.error || data.msg);
      }
    } catch (error) {
      setError("Error sending message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg p-4 w-75 bg-warning">
        <h2 className="text-center fw-bold text-primary mb-4">Contact Us</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Contact Form */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Your Message</label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <div className="mb-3 d-flex align-items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-primary me-2 fs-4" />
              <p className="mb-0 fw-semibold">blahfoundation@gmail.com</p>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <FontAwesomeIcon icon={faPhone} className="text-primary me-2 fs-4" />
              <p className="mb-0 fw-semibold">+254 768 323 735</p>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary me-2 fs-4" />
              <p className="mb-0 fw-semibold">Moringa School, Nairobi, Kenya</p>
            </div>

            {/* Social Media Icons */}
            <div className="mt-3 d-flex gap-3">
              <a href="#" className="text-primary fs-3"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="text-primary fs-3"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="text-primary fs-3"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="text-primary fs-3"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
