import React from "react";
const WhoWeAre = () => {
  return (
    <section ref={aboutRef} className="p-12 text-center bg-gray-100">
        <h2 className="text-4xl font-bold">Who We Are</h2>
        <p className="mt-4 text-gray-700">Learn more about our mission and team.</p>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(managementRef)}>
          Management Team
        </button>
      </section>
  );
};
export default WhoWeAre;
