import React, { useRef } from "react";

const Home = () => {
  const aboutRef = useRef(null);
  const managementRef = useRef(null);
  const getInvolvedRef = useRef(null);
  const recordsRef = useRef(null);
  const donateRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section flex flex-col items-center justify-center text-center text-white min-h-screen">
        <h1 className="text-5xl font-bold">Welcome to BLAH Foundation</h1>
        <p className="text-lg mt-4">Empowering Communities for a Better Tomorrow</p>
        <button 
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition" 
          onClick={() => scrollToSection(aboutRef)}>
          Learn More
        </button>
      </section>
      
      {/* Who We Are Section */}
      <section ref={aboutRef} className="p-12 text-center bg-gray-100">
        <h2 className="text-4xl font-bold">Who We Are</h2>
        <p className="mt-4 text-gray-700">Learn more about our mission and team.</p>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(managementRef)}>
          Management Team
        </button>
      </section>

      {/* Management Team */}
      <section ref={managementRef} className="p-12 text-center bg-gray-200">
        <h2 className="text-4xl font-bold">Management Team</h2>
        <p className="mt-4 text-gray-700">Zuruel, James, and Iris lead our organization.</p>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(getInvolvedRef)}>
          Get Involved
        </button>
      </section>

      {/* Get Involved */}
      <section ref={getInvolvedRef} className="p-12 text-center bg-gray-300">
        <h2 className="text-4xl font-bold">Get Involved</h2>
        <p className="mt-4 text-gray-700">Join our mission.</p>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(recordsRef)}>
          View Records
        </button>
      </section>

      {/* Records */}
      <section ref={recordsRef} className="p-12 text-center bg-gray-400">
        <h2 className="text-4xl font-bold">Records</h2>
        <p className="mt-4 text-gray-700">See the impact of our initiatives.</p>
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition" onClick={() => scrollToSection(donateRef)}>
          Donate Now
        </button>
      </section>

      {/* Donate */}
      <section ref={donateRef} className="p-12 text-center bg-gray-500">
        <h2 className="text-4xl font-bold">Donate</h2>
        <p className="mt-4 text-gray-700">Support our mission.</p>
      </section>
    </div>
  );
};

export default Home;
