import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProfileForm = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    age: "",
    gender: "",
    location: "",
    social_background: "",
    phone_number: "",
    image_url: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login"); // Ensure user is logged in

    // Check if user already has a profile
    const checkProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/profile/${user.id}`);
        const data = await response.json();

        if (response.ok && data.profile_exists) {
          navigate("/"); // Redirect to home if profile exists
        } else {
          setLoading(false); // Show form if no profile
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };

    checkProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value || "", 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user || !user.id) {
      setError("User authentication failed. Please log in.");
      return;
    }

    const payload = {
      ...profileData,
      user_id: user.id,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit profile");

      // ✅ Update `profiles_completed` in user table
      await fetch(`http://127.0.0.1:5000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profiles_completed: true }),
      });

      console.log("✅ Profile created successfully!");
      setUser({ ...user, profiles_completed: true }); // Update context
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("🚨 Error submitting profile:", error.message);
      setError("Failed to create profile. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>; // Prevent showing form while checking

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Create Profile</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="full_name" value={profileData.full_name} onChange={handleChange} placeholder="Full Name" className="form-control mb-2" required />
          <input type="number" name="age" value={profileData.age} onChange={handleChange} placeholder="Age" className="form-control mb-2" required />
          <select name="gender" value={profileData.gender} onChange={handleChange} className="form-control mb-2" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="text" name="location" value={profileData.location} onChange={handleChange} placeholder="Location" className="form-control mb-2" required />
          <input type="text" name="social_background" value={profileData.social_background} onChange={handleChange} placeholder="Social Background" className="form-control mb-2" required />
          <input type="text" name="phone_number" value={profileData.phone_number} onChange={handleChange} placeholder="Phone Number" className="form-control mb-2" required />
          <input type="text" name="image_url" value={profileData.image_url} onChange={handleChange} placeholder="Profile Image URL" className="form-control mb-2" />
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
