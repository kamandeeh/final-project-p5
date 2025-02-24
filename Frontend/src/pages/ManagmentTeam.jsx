import React from "react";

const ManagementTeam = () => {

  const managementRef = useRef(null);
  
  return (
    <section ref={managementRef} className="p-12 text-center bg-gray-200">
        <h2 className="text-4xl font-bold">Management Team</h2>
        <p className="mt-4 text-gray-700">Zuruel, James, and Iris lead our organization.</p>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition" onClick={() => scrollToSection(getInvolvedRef)}>
          Get Involved
        </button>
      </section>
  );
};
export default ManagementTeam;
