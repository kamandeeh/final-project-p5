import React, { useState } from "react";

const counties = ["Mombasa", "Nairobi", "Kisumu"];
const statistics = {
  "Mombasa": { poverty: "30%", employment: "45%", socialIntegration: "60%" },
  "Nairobi": { poverty: "25%", employment: "50%", socialIntegration: "70%" },
  "Kisumu": { poverty: "35%", employment: "40%", socialIntegration: "65%" }
};

const Records = () => {
  const [selectedCounty, setSelectedCounty] = useState(null);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold">Records</h1>
      <ul className="grid grid-cols-3 gap-4 mt-4">
        {counties.map((county, index) => (
          <li key={index} className="bg-gray-200 p-2 rounded cursor-pointer" onClick={() => setSelectedCounty(selectedCounty === county ? null : county)}>
            {county}
            {selectedCounty === county && statistics[county] && (
              <ul className="mt-2 bg-white shadow-md p-2 rounded">
                <li><strong>Poverty Eradication:</strong> {statistics[county].poverty}</li>
                <li><strong>Employment Generation:</strong> {statistics[county].employment}</li>
                <li><strong>Social Integration:</strong> {statistics[county].socialIntegration}</li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Records;
