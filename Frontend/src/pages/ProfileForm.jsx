import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProfileForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    age: "",
    gender: "",
    location: "",
    social_background: "",
    phone_number: "",
    image_url: "",  // Expecting a string, not a file
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.user_id) {
      console.error("User ID is missing or undefined!");
      return;
    }

    const fetchProfile = async () => {
      console.log(`Fetching profile for User ID: ${user.user_id}`);
      try {
        const response = await fetch(`http://127.0.0.1:5000/profile/${user.user_id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        console.log("Fetched profile:", data);

        setProfileData((prev) => ({
          ...prev,
          ...data.profile,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        setError("Could not fetch profile. Please try again.");
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value || "", 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user || !user.user_id) {  
      setError("User ID is missing!");
      return;
    }

    const payload = {
      ...profileData,
      user_id: user.user_id, 
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit profile");

      console.log("Profile submitted successfully!");
      navigate("/profile"); // Redirect after success
    } catch (error) {
      console.error("Error submitting profile:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Profile Form</h2>
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
