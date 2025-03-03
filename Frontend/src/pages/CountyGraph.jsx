import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer 
} from "recharts";
import "./CountyGraph.css";
const CountyBarChart = () => {
  const [counties, setCounties] = useState([]);  
  const [selectedCounty, setSelectedCounty] = useState("Nairobi");  
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/records") 
      .then(res => res.json())
      .then(records => {
        const countyList = records.map(record => ({
          name: record.county,
          category: record.category // Ensure category exists in API response
        }));
        setCounties(countyList);
      })
      .catch(error => console.error("Error fetching counties:", error));
  }, []);
  

  useEffect(() => {
    if (selectedCounty) {
      fetch(`http://127.0.0.1:5000/county_statistics?county=${selectedCounty}`)
        .then(res => res.json())
        .then(stats => {
          if (stats.length > 0) {
            const formattedData = stats.map(stat => ({
              name: selectedCounty,
              Poverty: stat.poverty,
              Employment: stat.employment,
              "Social Integration": stat.social_integration
            }));
            setData(formattedData);
          } else {
            setData([]); 
          }
        })
        .catch(error => console.error("Error fetching data:", error));
    }
  }, [selectedCounty]);
  
  return (
    <div className="chart-container">
      {/* Card Wrapper */}
      <div className="chart-card">
        <h2 className="chart-title">County Statistics</h2>

      <div className="dropdown-container">
          <select 
            value={selectedCounty} 
            onChange={(e) => {
              const [county, category] = e.target.value.split("|"); // Extract both values
              setSelectedCounty(county);
            }}
            className="dropdown"
          >
            {counties.map((countyObj, index) => (
              <option 
                key={index} 
                value={`${countyObj.name}|${countyObj.category}`} // Store both values
              >
                {countyObj.name} - {countyObj.category}  {/* Display both */}
              </option>
            ))}
          </select>
      </div>


        {/* Graph */}
        <div className="graph-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Poverty" fill="#e63946" />
              <Bar dataKey="Employment" fill="#2a9d8f" />
              <Bar dataKey="Social Integration" fill="#f4a261" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CountyBarChart;
