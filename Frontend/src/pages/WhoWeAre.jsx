import React, { useRef } from "react";

const WhoWeAre = () => {
  const aboutRef = useRef(null);
  const managementRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={aboutRef} className="p-12 text-center bg-gray-100">
      <h2 className="text-4xl font-bold">Who We Are</h2>
      <p className="mt-4 text-gray-700">Learn more about our mission and team.</p>

      <button
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        onClick={() => scrollToSection(managementRef)}
      >
        Management Team
      </button>

      {/* Add Management Team Section for scrolling */}
      <div ref={managementRef} className="mt-12 p-8 bg-gray-200 rounded-lg">
        <h3 className="text-2xl font-semibold">Our Leadership</h3>
        <p className="mt-2 text-gray-700">
          Meet the passionate leaders dedicated to our mission.
        </p>
      </div>
    </section>
  );
};

export default WhoWeAre;
