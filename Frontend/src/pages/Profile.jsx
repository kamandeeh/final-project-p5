import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const userId = user?.id || localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    // Store userId in localStorage for persistence
    if (user?.id) {
      localStorage.setItem("userId", user.id);
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://final-project-p5.onrender.com/profile/${userId}`);
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (notFound)
    return (
      <div className="container mt-5 text-center">
        <p className="alert alert-warning">You have not created a profile yet.</p>
        <button className="btn btn-primary" onClick={() => navigate("/profile-form")}>
          Create Profile
        </button>
      </div>
    );

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center">
          <img
            src={profile.image_url ? `https://final-project-p5.onrender.com${profile.image_url}` : "/default-avatar.png"}
            alt="Profile"
            className="rounded-circle shadow"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "3px solid #007bff",
            }}
          />
          <h2 className="mt-3">{profile.full_name}</h2>
        </div>
        <hr />
        <div className="mt-3">
          <p><strong>📅 Age:</strong> {profile.age}</p>
          <p><strong>⚤ Gender:</strong> {profile.gender}</p>
          <p><strong>📍 Location:</strong> {profile.location}</p>
          <p><strong>📞 Phone:</strong> {profile.phone_number}</p>
          <p><strong>🌍 Social Background:</strong> {profile.social_background}</p>
        </div>
        <div className="d-grid mt-4">
          <button className="btn btn-primary" onClick={() => navigate("/profile-form")}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
