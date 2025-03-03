import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token"); // Assuming JWT is stored
      if (!token) {
        setError("Unauthorized access");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.status === 403) {
          setError("Access Denied: Admins Only");
        } else {
          setRecords(data.records);
        }
      } catch (err) {
        setError("Error fetching admin data");
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <h2 className="text-center text-primary">Admin Dashboard</h2>
      <ul className="list-group">
        {records.map((record) => (
          <li key={record.id} className="list-group-item">
            {record.county} - {record.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
