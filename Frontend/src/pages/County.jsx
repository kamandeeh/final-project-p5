import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CountyPage = () => {
  const [counties, setCounties] = useState([]);
  const [randomCounties, setRandomCounties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomCounties = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/random_counties");
        if (!response.ok) throw new Error("Failed to fetch random counties");
  
        const data = await response.json();
        console.log("Fetched Random Counties:", data); // Debugging line
        setRandomCounties(data);
      } catch (error) {
        console.error("Error fetching random counties:", error);
      }
    };
  
    fetchRandomCounties();
  }, []);
  

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSelectedCounty(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?query=${searchTerm}`);
      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setCounties(data);

      if (data.length === 1) {
        setSelectedCounty(data[0]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGraph = (county) => {
    navigate(`/county/${county.county}/bar_graph`);
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <h2 className="text-center fw-bold text-primary mb-4">
        🌍 Explore <span className="text-dark">Counties</span>
      </h2>

      {/* Search Bar */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search for a county..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50 shadow-sm border-primary"
          style={{ maxWidth: "400px" }}
        />
        <button onClick={handleSearch} className="btn btn-primary ms-2">
          Search
        </button>
      </div>

      {/* Display 3 Random Counties */}
      {randomCounties.length > 0 && (
        <div className="row g-3 mb-4">
          <h5 className="text-center text-muted">✨ Explore Random Counties</h5>
          {randomCounties.map((county, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4">
              <div className="card county-card shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{county.county}</h5>
                  <p className="card-text text-muted">Category: {county.category}</p>
                  <button onClick={() => handleViewGraph(county)} className="btn btn-outline-primary btn-sm">
                    📊 View Graph
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animated Loader */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">🔄 Searching...</p>
        </div>
      )}

      {/* Display County Results */}
      <div className="row g-4 mt-3">
        {counties.length > 0 ? (
          counties.map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card county-card shadow-sm text-center">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">{item.county}</h5>
                  <p className="card-text text-muted">Category: {item.category}</p>
                  <button onClick={() => handleViewGraph(item)} className="btn btn-outline-primary btn-sm">
                    📊 View Graph
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-muted mt-3">⚠️ No results found.</p>
        )}
      </div>
    </div>
  );
};

export default CountyPage;
