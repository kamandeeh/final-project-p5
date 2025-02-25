import React, { useRef } from "react";

const ManagementTeam = () => {
  const managementRef = useRef(null);
  const getInvolvedRef = useRef(null); // Assuming this will be used for scrolling

  const scrollToSection = () => {
    if (getInvolvedRef.current) {
      getInvolvedRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const teamMembers = [
    { name: "Zuruel", role: "CEO", image: "https://img.freepik.com/free-vector/young-prince-royal-attire_1308-176144.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid" },
    { name: "James", role: "CTO", image: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid" },
    { name: "Iris", role: "COO", image: "https://img.freepik.com/free-vector/professional-tiktok-profile-picture_742173-5866.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid" },
  ];

  return (
    <section ref={managementRef} className="p-12 text-center bg-gray-200">
      <h2 className="text-4xl font-bold mb-6">Management Team</h2>
      <p className="text-lg text-gray-700 mb-8">
        Zuruel, James, and Iris lead our organization with dedication and passion.
      </p>

      <div className="flex justify-center gap-6 flex-row-reverse">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-1/4 min-w-[180px]"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4" // Reduced image size
            />
            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
            <p className="text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={scrollToSection}
        >
          Get Involved
        </button>
      </div>
    </section>
  );
};

export default ManagementTeam;
