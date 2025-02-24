import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; 
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import ManagementTeam from "./pages/ManagmentTeam";
import GetInvolved from "./pages/Getinvolved";
import Records from "./pages/Records";
import Donate from "./pages/Donate";
import WhoWeAre from "./pages/WhoWeAre";
import Contactus from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

function App() {

  const clientId = "787148443112-mnl2dqtoevqgnqasod1str5al6f1piiq.apps.googleusercontent.com"; 

  return (
    <UserProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="/who-we-are/about-us" element={<AboutUs />} />
            <Route path="/who-we-are/management-team" element={<ManagementTeam />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/get-involved/records" element={<Records />} />
            <Route path="/get-involved/donate" element={<Donate />} />
            <Route path="/contact" element={<Contactus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/records" element={<Records />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/management-team" element={<ManagementTeam />} />
          </Routes>
          <Footer />
        </Router>
      </GoogleOAuthProvider>
    </UserProvider>
  );
}

export default App;
