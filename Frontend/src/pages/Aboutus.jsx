import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container py-5 text-center text-white" style={{ background: "#1c1c1c", minHeight: "100vh" }}>
      <div className="mb-4">
        <h1 className="display-4 fw-bold">About Us</h1>
        <p className="lead text-light">
          The <strong>BLAH Foundation</strong> is dedicated to fighting poverty, empowering communities, and fostering social integration.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <p className="fs-5">
            Our mission is to build a <strong>secure, just, and inclusive</strong> society by creating opportunities and raising living standards.
            We ensure <strong>no one is left behind</strong> in our fight for a better tomorrow.
          </p>

          {/* Show More Content */}
          {showMore ? (
            <div className="mt-4">
              <h2 className="h3 fw-semibold">Our Focus Areas</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent text-light">
                  <strong>Poverty Eradication:</strong> Implementing sustainable solutions for long-term impact.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Employment Generation:</strong> Creating job opportunities and supporting entrepreneurs.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Social Integration:</strong> Building inclusive communities for all.
                </li>
              </ul>

              <h2 className="h3 fw-semibold mt-4">Our Vision</h2>
              <p className="fs-5">A world where everyone has the opportunity to live with dignity, free from poverty and inequality.</p>

              <h2 className="h3 fw-semibold mt-4">Our Mission</h2>
              <p className="fs-5">To develop and implement innovative solutions addressing poverty, employment, and social inclusion.</p>

              <h2 className="h3 fw-semibold mt-4">Our Values</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent text-light">
                  <strong>Equity:</strong> Advocating for equal opportunities.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Sustainability:</strong> Creating long-lasting solutions.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Inclusivity:</strong> Ensuring everyone has a voice.
                </li>
              </ul>

              <h2 className="h3 fw-semibold mt-4">Our Approach</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent text-light">
                  <strong>Innovation:</strong> Using technology to drive social change.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Collaboration:</strong> Partnering with governments, NGOs, and communities.
                </li>
                <li className="list-group-item bg-transparent text-light">
                  <strong>Empowerment:</strong> Fostering self-development and independence.
                </li>
              </ul>

              <div className="text-center mt-4">
                <button className="btn btn-danger btn-lg" onClick={() => setShowMore(false)}>Show Less</button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4">
              <button className="btn btn-primary btn-lg" onClick={() => setShowMore(true)}>Learn More</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
