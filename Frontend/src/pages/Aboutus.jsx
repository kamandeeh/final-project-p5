import React, { useState } from "react";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="text-gray-600 mt-2">
        Blah Company is a forward-thinking organization dedicated to addressing some of the world's most pressing challenges,
        including poverty eradication, employment generation, and social integration. Our mission is to contribute to the
        creation of an international community that fosters secure, just, free, and harmonious societies. We believe in offering
        opportunities and higher standards of living for all, ensuring that no one is left behind.
      </p>
      
      {showMore ? (
        <>
          <h2 className="text-2xl font-bold mt-4">Our Core Focus Areas:</h2>
          <ul className="text-gray-600 mt-2">
            <li><strong>Poverty Eradication:</strong> We implement sustainable solutions that address the root causes of poverty.</li>
            <li><strong>Employment Generation:</strong> By creating job opportunities and supporting entrepreneurship, we empower individuals.</li>
            <li><strong>Social Integration:</strong> We strive to build inclusive societies where everyone has the opportunity to thrive.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-4">Our Vision:</h2>
          <p className="text-gray-600 mt-2">To create a world where everyone has the opportunity to live a life of dignity, free from poverty and inequality.</p>

          <h2 className="text-2xl font-bold mt-4">Our Mission:</h2>
          <p className="text-gray-600 mt-2">To develop and implement innovative solutions that address the root causes of poverty, generate employment, and promote social integration.</p>
          
          <h2 className="text-2xl font-bold mt-4">Our Values:</h2>
          <ul className="text-gray-600 mt-2">
            <li><strong>Equity:</strong> We believe in equal opportunities for all.</li>
            <li><strong>Sustainability:</strong> Our solutions are designed to be sustainable and long-lasting.</li>
            <li><strong>Inclusivity:</strong> We are committed to creating inclusive communities where everyone has a voice.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-4">Our Approach:</h2>
          <ul className="text-gray-600 mt-2">
            <li><strong>Innovation:</strong> Leveraging cutting-edge technology to solve social problems.</li>
            <li><strong>Collaboration:</strong> Working with governments, NGOs, and local communities.</li>
            <li><strong>Empowerment:</strong> Focusing on empowering individuals and communities for self-development.</li>
          </ul>
        </>
      ) : (
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowMore(true)}>
          Read more from Our Impact
        </button>
      )}
    </div>
  );
};

export default AboutUs;
