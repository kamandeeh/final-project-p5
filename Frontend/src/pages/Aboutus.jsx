import React, { useState } from "react";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">About Us</h1>
        <p className="text-lg text-gray-600 mt-2">
          BLAH Foundation is committed to eradicating poverty, generating employment, and promoting social integration.
        </p>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-700">
          Our mission is to foster a secure, just, and inclusive society by creating opportunities and raising living standards.
          We are dedicated to ensuring that no one is left behind.
        </p>
      </div>

      {showMore ? (
        <div className="max-w-3xl mx-auto mt-6 text-gray-700">
          <h2 className="text-2xl font-semibold mt-4">Our Core Focus Areas</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Poverty Eradication:</strong> Implementing sustainable solutions for long-term impact.</li>
            <li><strong>Employment Generation:</strong> Creating job opportunities and supporting entrepreneurs.</li>
            <li><strong>Social Integration:</strong> Building inclusive communities for all.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">Our Vision</h2>
          <p>A world where everyone has the opportunity to live with dignity, free from poverty and inequality.</p>

          <h2 className="text-2xl font-semibold mt-4">Our Mission</h2>
          <p>To develop and implement innovative solutions addressing poverty, employment, and social inclusion.</p>

          <h2 className="text-2xl font-semibold mt-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Equity:</strong> Advocating for equal opportunities.</li>
            <li><strong>Sustainability:</strong> Creating long-lasting solutions.</li>
            <li><strong>Inclusivity:</strong> Ensuring everyone has a voice.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-4">Our Approach</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Innovation:</strong> Using technology to drive social change.</li>
            <li><strong>Collaboration:</strong> Partnering with governments, NGOs, and communities.</li>
            <li><strong>Empowerment:</strong> Fostering self-development and independence.</li>
          </ul>

          <div className="text-center mt-6">
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
              onClick={() => setShowMore(false)}
            >
              Show Less
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => setShowMore(true)}
          >
            Learn More
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
