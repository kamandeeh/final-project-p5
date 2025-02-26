import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus"; 
import ManagementTeam from "./pages/ManagmentTeam"; 
import Getinvolved from "./pages/Getinvolved";
import Records from "./pages/Records";
import Donate from "./pages/Donate";
import ContactUs from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Reviews from "./pages/Reviews";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const App = () => {
  const clientId = "787148443112-mnl2dqtoevqgnqasod1str5al6f1piiq.apps.googleusercontent.com"; 

  return (
    <div className="app-container">
      <UserProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <Router>
            <Navbar />
            <main className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<Aboutus />} /> {/* ✅ Fixed route */}
                <Route path="/management-team" element={<ManagementTeam />} />
                <Route path="/get-involved" element={<Getinvolved />} />
                <Route path="/records" element={<Records />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/reviews" element={<Reviews />} />
              </Routes>
            </main>
            <Footer />
          </Router>
        </GoogleOAuthProvider>
      </UserProvider>
    </div>
  );
};

export default App;
