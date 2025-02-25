import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import ManagementTeam from "./pages/ManagmentTeam";
import GetInvolved from "./pages/Getinvolved";
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
import "./index.css";

const App = () => {
  const clientId = "787148443112-mnl2dqtoevqgnqasod1str5al6f1piiq.apps.googleusercontent.com"; 

  return (
    <UserProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/management-team" element={<ManagementTeam />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/records" element={<Records />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
          <Footer />
        </Router>
      </GoogleOAuthProvider>
    </UserProvider>
  );
};

export default App;
