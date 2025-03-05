import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [formData, setFormData] = useState({ county_id: "", poverty: "", employment: "", social_integration: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("https://final-project-p5.onrender.com/county_statistics");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editId ? `https://final-project-p5.onrender.com/county_statistics/${editId}` : "https://final-project-p5.onrender.com/county_statistics";
      const method = editId ? "put" : "post";
      await axios[method](`http://127.0.0.1:5000${endpoint}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchStatistics();
      setFormData({ county_id: "", poverty: "", employment: "", social_integration: "" });
      setEditId(null);
    } catch (error) {
      console.error("Error saving statistics:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://final-project-p5.onrender.com/county_statistics/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchStatistics();
    } catch (error) {
      console.error("Error deleting statistic:", error);
    }
  };

  const handleEdit = (stat) => {
    setFormData(stat);
    setEditId(stat.id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Form for Adding/Editing Stats */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="number" name="county_id" value={formData.county_id} onChange={handleChange} placeholder="County ID" required className="border p-2 w-full mb-2" />
        <input type="number" name="poverty" value={formData.poverty} onChange={handleChange} placeholder="Poverty Level" required className="border p-2 w-full mb-2" />
        <input type="number" name="employment" value={formData.employment} onChange={handleChange} placeholder="Employment Rate" required className="border p-2 w-full mb-2" />
        <input type="number" name="social_integration" value={formData.social_integration} onChange={handleChange} placeholder="Social Integration" required className="border p-2 w-full mb-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">{editId ? "Update" : "Add"} Statistics</button>
      </form>

      {/* Display Statistics Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">County ID</th>
            <th className="border p-2">Poverty</th>
            <th className="border p-2">Employment</th>
            <th className="border p-2">Social Integration</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.id} className="border">
              <td className="border p-2">{stat.county_id}</td>
              <td className="border p-2">{stat.poverty}</td>
              <td className="border p-2">{stat.employment}</td>
              <td className="border p-2">{stat.social_integration}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(stat)} className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Edit</button>
                <button onClick={() => handleDelete(stat.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
