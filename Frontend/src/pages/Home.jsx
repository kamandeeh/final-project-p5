import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // Ensure this file contains animations

const Home = () => {
  const aboutSectionRef = useRef(null);

  // Scroll to "What We Do" when button is clicked
  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center vh-100">
        <div className="content">
          <h1 className="display-4 fw-bold animate-fadeIn">Welcome to BLAH Foundation</h1>
          <p className="fs-4 mt-3 animate-fadeIn delay-300">Empowering Communities for a Better Tomorrow</p>
          <button className="btn btn-warning btn-lg mt-4 animate-fadeIn delay-600" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>
      </section>

      {/* What We Do Section */}
      <section ref={aboutSectionRef} id="about-section" className="container my-5 animate-slideUp">
        <h2 className="text-center fw-bold mb-4">What We Do</h2>
        <div className="row">
          {/* Card 1 - Education Support */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm animate-slideLeft">
              <img
                src="https://images.unsplash.com/photo-1567002349727-f1d1dcdab101?q=80&w=2070&auto=format&fit=crop"
                className="card-img-top"
                alt="Education Support"
              />
              <div className="card-body">
                <h5 className="card-title">Education Support</h5>
                <p className="card-text">We provide scholarships and educational resources to children in need.</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Healthcare Programs */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm animate-slideUp">
              <img
                src="https://images.unsplash.com/photo-1549983885-5c9eeb881f44?q=80&w=2070&auto=format&fit=crop"
                className="card-img-top"
                alt="Healthcare Programs"
              />
              <div className="card-body">
                <h5 className="card-title">Healthcare Programs</h5>
                <p className="card-text">Our foundation ensures access to medical care and essential health services.</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Community Development */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm animate-slideRight">
              <img
                src="https://images.unsplash.com/photo-1606963303013-a923eb64448e?q=80&w=2070&auto=format&fit=crop"
                className="card-img-top"
                alt="Community Development"
              />
              <div className="card-body">
                <h5 className="card-title">Community Development</h5>
                <p className="card-text">We empower communities through skill development and social integration programs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
