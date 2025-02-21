import React, { useRef } from "react";

const Home = () => {
  const aboutRef = useRef(null);
  

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
    </div>
  );
};

export default Home;
