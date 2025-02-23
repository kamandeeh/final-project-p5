import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGitHubToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const response = await fetch("http://127.0.0.1:5000/api/auth/github/callback?code=" + code, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          navigate("/dashboard");
        }
      }
    };

    fetchGitHubToken();
  }, [navigate]);

  return <p>Authenticating with GitHub...</p>;
};

export default GitHubCallback;
