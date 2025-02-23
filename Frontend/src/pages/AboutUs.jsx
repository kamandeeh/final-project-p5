import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#ffffff" }}>
      <div className="container text-center">
        <h1 className="fw-bold mb-4">About Us</h1>
        <p className="text-secondary">
          Blah Company is a forward-thinking organization dedicated to addressing some of the world's most pressing challenges,
          including poverty eradication, employment generation, and social integration. Our mission is to contribute to the
          creation of an international community that fosters secure, just, free, and harmonious societies.
        </p>

        {showMore ? (
          <>
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card text-white shadow-lg" style={{ backgroundColor: "#34495e" }}>
                  <div className="card-body">
                    <h5 className="card-title">Poverty Eradication</h5>
                    <p className="card-text">We implement sustainable solutions that address the root causes of poverty.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white shadow-lg" style={{ backgroundColor: "#34495e" }}>
                  <div className="card-body">
                    <h5 className="card-title">Employment Generation</h5>
                    <p className="card-text">By creating job opportunities and supporting entrepreneurship, we empower individuals.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-white shadow-lg" style={{ backgroundColor: "#34495e" }}>
                  <div className="card-body">
                    <h5 className="card-title">Social Integration</h5>
                    <p className="card-text">We strive to build inclusive societies where everyone has the opportunity to thrive.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="fw-bold mt-5">Our Vision</h2>
            <p className="text-secondary">To create a world where everyone has the opportunity to live a life of dignity, free from poverty and inequality.</p>

            <h2 className="fw-bold mt-4">Our Mission</h2>
            <p className="text-secondary">To develop and implement innovative solutions that address the root causes of poverty, generate employment, and promote social integration.</p>

            <button className="btn btn-danger mt-3 px-4 py-2" onClick={() => setShowMore(false)}>
              Show Less
            </button>
          </>
        ) : (
          <button className="btn btn-primary mt-4 px-4 py-2" onClick={() => setShowMore(true)}>
            Read more from Our Impact
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
