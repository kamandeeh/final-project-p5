import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Edit, Trash2, Plus, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [countyStats, setCountyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [adminEmail, setAdminEmail] = useState("");
  const [adminMessage, setAdminMessage] = useState(null);
  const [formData, setFormData] = useState({
    county_id: '',
    poverty: '',
    employment: '',
    social_integration: ''
  });
  const [notification, setNotification] = useState(null);

  // Fetch all county statistics
  useEffect(() => {
    fetchCountyStats();
  }, []);

  const fetchCountyStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://final-project-p5.onrender.com/county_statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch county statistics (${response.status})`);
      }
      
      const data = await response.json();
      setCountyStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching county statistics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setFormMode('create');
    setFormData({
      county_id: '',
      poverty: '',
      employment: '',
      social_integration: ''
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (stats) => {
    setFormMode('edit');
    setFormData({
      county_id: stats.county_id,
      poverty: stats.poverty,
      employment: stats.employment,
      social_integration: stats.social_integration
    });
    setSelectedCounty(stats);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (countyId) => {
    if (!window.confirm('Are you sure you want to delete these statistics?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://final-project-p5.onrender.com/county_statistics/${countyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete county statistics (${response.status})`);
      }
      
      // Remove the deleted item from the state
      setCountyStats(countyStats.filter(stats => stats.county_id !== countyId));
      showNotification('Statistics deleted successfully', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
      console.error('Error deleting county statistics:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Better input validation
    let parsedValue = value;
    if (name === 'county_id') {
      parsedValue = value === '' ? '' : parseInt(value) || '';
    } else {
      parsedValue = value === '' ? '' : parseFloat(value) || '';
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.county_id || formData.poverty === '' || formData.employment === '' || formData.social_integration === '') {
      showNotification('All fields are required', 'error');
      return;
    }
    
    try {
      let response;
      let requestBody;
      
      if (formMode === 'create') {
        requestBody = { ...formData };
        response = await fetch('https://final-project-p5.onrender.com/county_statistics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestBody)
        });
      } else {
        requestBody = {
          poverty: formData.poverty,
          employment: formData.employment,
          social_integration: formData.social_integration
        };
        response = await fetch(`https://final-project-p5.onrender.com/county_statistics/${formData.county_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestBody)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${formMode} county statistics (${response.status})`);
      }
      
      const result = await response.json();
      
      // Update the state
      if (formMode === 'create') {
        setCountyStats([...countyStats, result.statistics || result]);
      } else {
        setCountyStats(countyStats.map(stats => 
          stats.county_id === formData.county_id ? (result.statistics || result) : stats
        ));
      }
      
      // Close the form and show success message
      setIsFormOpen(false);
      showNotification(`Statistics ${formMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
      fetchCountyStats(); // Refresh data after successful operation
    } catch (err) {
      showNotification(err.message, 'error');
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} county statistics:`, err);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddAdmin = async () => {
    if (!adminEmail) {
        setAdminMessage({ type: "error", text: "Please enter a valid email." });
        return;
    }

    try {
        const response = await fetch("https://final-project-p5.onrender.com/promote_user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user is authenticated
            },
            body: JSON.stringify({ email: adminEmail }),
        });

        const data = await response.json();

        if (response.ok) {
            setAdminMessage({ type: "success", text: data.message });
            setAdminEmail(""); // Clear input field
        } else {
            setAdminMessage({ type: "error", text: data.error || "Something went wrong" });
        }
    } catch (error) {
        setAdminMessage({ type: "error", text: "Failed to update admin status." });
    }
};

  if (isLoading && countyStats.length === 0) {
    return (
      <div className="container-fluid pt-5 mt-4">
        <div className="d-flex justify-content-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading county statistics...</span>
          </div>
          <span className="ms-2">Loading county statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-5 mt-4">
      <div className="card shadow">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <h2 className="mb-0">County Statistics Administration</h2>
          <button 
            onClick={handleCreateClick} 
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <Plus size={16} /> Add New Statistics
          </button>
        </div>
        <div className="card-body">
          {notification && (
            <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
              {notification.type === 'success' ? <CheckCircle size={18} className="me-2" /> : <AlertCircle size={18} className="me-2" />}
              {notification.message}
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center">
              <AlertCircle size={18} className="me-2" />
              {error}
              <button 
                className="btn btn-sm btn-outline-danger ms-auto"
                onClick={() => fetchCountyStats()}
              >
                Retry
              </button>
            </div>
          )}
          
          {isFormOpen && (
            <div className="card mb-4 border">
              <div className="card-body">
                <h3 className="card-title">{formMode === 'create' ? 'Create New' : 'Edit'} Statistics</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">County ID</label>
                    <input 
                      type="number" 
                      name="county_id"
                      value={formData.county_id}
                      onChange={handleInputChange}
                      disabled={formMode === 'edit'}
                      className="form-control"
                      required
                      min="1"
                    />
                    {formMode === 'create' && countyStats.some(stat => stat.county_id === formData.county_id) && formData.county_id !== '' && (
                      <div className="text-danger mt-1">
                        <small>A county with this ID already exists. Please use a different ID.</small>
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Poverty Rate</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="poverty"
                      value={formData.poverty}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      min="0"
                      max="100"
                    />
                    <small className="text-muted">Enter a value between 0 and 100</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Employment Rate</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="employment"
                      value={formData.employment}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      min="0"
                      max="100"
                    />
                    <small className="text-muted">Enter a value between 0 and 100</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Social Integration</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="social_integration"
                      value={formData.social_integration}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      min="0"
                      max="100"
                    />
                    <small className="text-muted">Enter a value between 0 and 100</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={formMode === 'create' && countyStats.some(stat => stat.county_id === formData.county_id) && formData.county_id !== ''}
                    >
                      {formMode === 'create' ? 'Create' : 'Update'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsFormOpen(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {countyStats.length === 0 ? (
            <div className="text-center p-4 text-muted">
              No county statistics found. Create some using the button above.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>County ID</th>
                    <th>Poverty Rate</th>
                    <th>Employment Rate</th>
                    <th>Social Integration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countyStats.map((stats) => (
                    <tr key={stats.county_id}>
                      <td>{stats.county_id}</td>
                      <td>{stats.poverty.toFixed(2)}%</td>
                      <td>{stats.employment.toFixed(2)}%</td>
                      <td>{stats.social_integration.toFixed(2)}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            onClick={() => handleEditClick(stats)}
                            className="btn btn-sm btn-primary"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(stats.county_id)}
                            className="btn btn-sm btn-danger"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
         <div className="mb-4">
            <h4>Add Admin</h4>
            <input
                type="email"
                placeholder="Enter user email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="form-control mb-2"
            />
            <button onClick={handleAddAdmin} className="btn btn-success">
                <UserPlus size={16} /> Add Admin
            </button>
            
            {adminMessage && (
                <div className={`alert ${adminMessage.type === "success" ? "alert-success" : "alert-danger"} mt-2`}>
                    {adminMessage.text}
                </div>
            )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;