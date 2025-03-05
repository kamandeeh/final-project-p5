import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer 
} from "recharts";
import "./CountyGraph.css";

const CountyBarChart = () => {
  const [counties, setCounties] = useState([]);  
  const [selectedCounty, setSelectedCounty] = useState("");  
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/records") 
      .then(res => res.json())
      .then(records => {
        if (!records || records.length === 0) {
          console.error("No records found.");
          return;
        }

        // Extract unique counties
        const uniqueCounties = Array.from(new Set(records.map(record => record.county)))
          .map(name => ({
            name,
            category: records.find(record => record.county === name)?.category || "Unknown"
          }));

        setCounties(uniqueCounties);
        
        // Set default county (first in list)
        if (uniqueCounties.length > 0) {
          setSelectedCounty(uniqueCounties[0].name);
        }
      })
      .catch(error => console.error("Error fetching counties:", error));
  }, []);
  
  useEffect(() => {
    if (selectedCounty) {
      const encodedCounty = encodeURIComponent(selectedCounty);  // Handle spaces in county names
      fetch(`http://127.0.0.1:5000/county_statistics/${encodedCounty}`)
        .then(res => res.json())
        .then(stats => {
          if (!stats || stats.length === 0) {
            console.warn("No data found for the selected county.");
            setData([]); 
            return;
          }

          setData(stats.map(stat => ({
            name: selectedCounty,
            Poverty: stat.poverty || 0,
            Employment: stat.employment || 0,
            "Social Integration": stat.social_integration || 0
          })));
        })
        .catch(error => console.error("Error fetching data:", error));
    }
  }, [selectedCounty]);

  return (
    <div className="chart-container">
      <div className="chart-card">
        <h2 className="chart-title">County Statistics</h2>

        {/* Dropdown */}
        <div className="dropdown-container">
          <select 
            value={selectedCounty} 
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="dropdown"
          >
            {counties.map((countyObj) => (
              <option key={countyObj.name} value={countyObj.name}>
                {countyObj.name} - {countyObj.category}
              </option>
            ))}
          </select>
        </div>

        {/* Graph */}
        <div className="graph-wrapper">
          {data.length > 0 ? (
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
          ) : (
            <p className="no-data-message">No data available for this county.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountyBarChart;
