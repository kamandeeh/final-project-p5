import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRecords } from "./RecordContext";

const CountyBarGraph = () => {
  const { searchByCounty } = useRecords();
  const [countyName, setCountyName] = useState("");
  const [countyData, setCountyData] = useState(null);

  const handleSearch = () => {
    const result = searchByCounty(countyName.trim());
    if (result.length > 0) {
      setCountyData(result[0]); 
    } else {
      setCountyData(null);
    }
  };

  const data = countyData
    ? [
        { name: "Poverty", value: parseFloat(countyData.poverty), fill: "#FF5733" },
        { name: "Employment", value: parseFloat(countyData.employment), fill: "#33FF57" },
        { name: "Social Integration", value: parseFloat(countyData.social_integration), fill: "#3385FF" }
      ]
    : [];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">County Statistics</h2>

      {/* Bar Graph */}
      {countyData ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 mt-4">No data found for the selected county.</p>
      )}
    </div>
  );
};

export default CountyBarGraph;
