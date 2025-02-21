import React from "react";
const GetInvolved = () => {
  const getInvolvedRef = useRef(null);
  return (
    <section ref={getInvolvedRef} className="p-12 text-center bg-gray-300">
    <h2 className="text-4xl font-bold">Get Involved</h2>
    <p className="mt-4 text-gray-700">Join our mission.</p>
    <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(recordsRef)}>
      View Records
    </button>
  </section>
  );
};
export default GetInvolved;
