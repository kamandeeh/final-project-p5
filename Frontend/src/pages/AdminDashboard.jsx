import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [formData, setFormData] = useState({
    county_id: "",
    poverty: "",
    employment: "",
    social_integration: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchStatistics();
  }, []);

  const checkAdmin = () => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("is_admin");

    if (!token || !isAdmin) {
      navigate("/login");
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://final-project-p5.onrender.com/county_statistics", {
        method: "GET",  // Ensure the method is GET
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error fetching statistics: ${response.status} ${response.statusText}. Details: ${errorDetails}`);
      }

      const data = await response.json();
      setStats(data);
      setMessage("Data loaded successfully.");
    } catch (error) {
      setMessage(error.message || "Error fetching statistics.");
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = editId
        ? `https://final-project-p5.onrender.com/county_statistics/${editId}`
        : "https://final-project-p5.onrender.com/county_statistics";
      const method = editId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error saving statistics.");
      }

      fetchStatistics();
      setFormData({
        county_id: "",
        poverty: "",
        employment: "",
        social_integration: "",
      });
      setEditId(null);
      setMessage(
        editId ? "Statistics updated successfully." : "Statistics added successfully."
      );
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Error saving statistics.");
      console.error("Error saving statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://final-project-p5.onrender.com/county_statistics/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting statistic.");
      }

      fetchStatistics();
      setMessage("Statistic deleted successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Error deleting statistic.");
      console.error("Error deleting statistic:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stat) => {
    setFormData({
      county_id: stat.county_id,
      poverty: stat.poverty,
      employment: stat.employment,
      social_integration: stat.social_integration,
    });
    setEditId(stat.id);
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Admin Dashboard</h2>

          {message && <p className="text-center text-success">{message}</p>}

          {/* Form for Adding/Editing Stats */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="number"
                name="county_id"
                value={formData.county_id}
                onChange={handleChange}
                placeholder="County ID"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="poverty"
                value={formData.poverty}
                onChange={handleChange}
                placeholder="Poverty Level"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="employment"
                value={formData.employment}
                onChange={handleChange}
                placeholder="Employment Rate"
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="social_integration"
                value={formData.social_integration}
                onChange={handleChange}
                placeholder="Social Integration"
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : editId ? "Update" : "Add"} Statistics
            </button>
          </form>

          {/* Statistics Table */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table table-bordered mt-4">
              <thead>
                <tr>
                  <th>County ID</th>
                  <th>Poverty</th>
                  <th>Employment</th>
                  <th>Social Integration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.id}>
                    <td>{stat.county_id}</td>
                    <td>{stat.poverty}</td>
                    <td>{stat.employment}</td>
                    <td>{stat.social_integration}</td>
                    <td>
                      <button onClick={() => handleEdit(stat)} className="btn btn-warning btn-sm mr-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(stat.id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
