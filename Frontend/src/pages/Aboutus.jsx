import React, { useState } from "react";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-4 fw-bold">About Us</h1>
        <p className="text-muted lead">
          Blah Foundation is committed to eradicating poverty, generating employment, and promoting social integration.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <p className="text-secondary">
            Our mission is to foster a secure, just, and inclusive society by creating opportunities and raising living standards.
            We are dedicated to ensuring that no one is left behind.
          </p>
        </div>
      </div>

      {showMore ? (
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <h2 className="h4 fw-bold">Our Core Focus Areas</h2>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item"><strong>Poverty Eradication:</strong> Implementing sustainable solutions for long-term impact.</li>
              <li className="list-group-item"><strong>Employment Generation:</strong> Creating job opportunities and supporting entrepreneurs.</li>
              <li className="list-group-item"><strong>Social Integration:</strong> Building inclusive communities for all.</li>
            </ul>

            <h2 className="h4 fw-bold">Our Vision</h2>
            <p className="text-secondary">A world where everyone has the opportunity to live with dignity, free from poverty and inequality.</p>

            <h2 className="h4 fw-bold">Our Mission</h2>
            <p className="text-secondary">To develop and implement innovative solutions addressing poverty, employment, and social inclusion.</p>

            <h2 className="h4 fw-bold">Our Values</h2>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item"><strong>Equity:</strong> Advocating for equal opportunities.</li>
              <li className="list-group-item"><strong>Sustainability:</strong> Creating long-lasting solutions.</li>
              <li className="list-group-item"><strong>Inclusivity:</strong> Ensuring everyone has a voice.</li>
            </ul>

            <h2 className="h4 fw-bold">Our Approach</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Innovation:</strong> Using technology to drive social change.</li>
              <li className="list-group-item"><strong>Collaboration:</strong> Partnering with governments, NGOs, and communities.</li>
              <li className="list-group-item"><strong>Empowerment:</strong> Fostering self-development and independence.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => setShowMore(true)}>
            Learn More
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
