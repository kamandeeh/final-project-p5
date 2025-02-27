import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CountyPage = () => {
  const [counties, setCounties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch counties when the search button is clicked
  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Prevent empty searches

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?query=${searchTerm}`);
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setCounties(data); // Update results

      if (data.length === 1) {
        setSelectedCounty(data[0]); // Show single result separately
      } else {
        setSelectedCounty(null);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to graph page
  const goToGraph = (county) => navigate(`/county/${county}/bar_graph`);

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold text-primary mb-4">Explore Counties</h2>

      {/* Search Input & Button */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search for a county..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50 me-2"
        />
        <button onClick={handleSearch} className="btn btn-primary">Search</button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-muted">Searching...</p>}

      {/* Display Selected County Info if Only One Result */}
      {selectedCounty && (
        <div className="alert alert-info text-center">
          <h4 className="fw-bold">{selectedCounty.county}</h4>
          <p className="mb-2">Category: {selectedCounty.category}</p>
          <button
            onClick={() => goToGraph(selectedCounty.county)}
            className="btn btn-outline-primary"
          >
            📊 View Graph
          </button>
        </div>
      )}

      {/* County Results Below Search */}
      <div className="row g-3">
        {counties.length > 0 ? (
          counties.map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card text-white bg-primary shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title">{item.county}</h5>
                  <p className="card-text">Category: {item.category}</p>
                  <button
                    onClick={() => goToGraph(item.county)}
                    className="btn btn-light btn-sm"
                  >
                    📊 View Graph
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-muted">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default CountyPage;
