import React from "react";

const managementTeam = [
  {
    name: "Zuruel Kamande",
    position: "",
    description: "Zuruel oversees backend and authentication of users."
  },
  {
    name: "Iris Macharia",
    position: "",
    description: "Iris oversees all styling and frontend of our project projects."
  },
  {
    name: "James Kimani",
    position: "",
    description: "James helped in the formation of both Frontend and Backend."
  }
];

const ManagementTeam = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "800px", width: "100%" }}>
        <div className="text-center mb-4">
          <h1 className="display-5 fw-bold">Our Management Team</h1>
          <p className="text-muted lead">Meet the passionate leaders driving our mission forward.</p>
        </div>
        
        <div className="row justify-content-center">
          {managementTeam.map((member, index) => (
            <div key={index} className="col-12 mb-3">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{member.name}</h5>
                  <h6 className="card-subtitle mb-2 text-primary">{member.position}</h6>
                  <p className="card-text text-secondary">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementTeam;
