import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import ManagementTeam from "./pages/ManagmentTeam";
import GetInvolved from "./pages/Getinvolved";
import CountyPage from "./pages/County";
import Donate from "./pages/Donate";
import WhoWeAre from "./pages/WhoWeAre";
import Contactus from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Signup from "./pages/Register";
import CountyBarGraph from "./pages/CountyGraph";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";
import { RecordsProvider } from "./context/RecordContext";
import "./index.css";

export default function App() {

  const clientId = "787148443112-mnl2dqtoevqgnqasod1str5al6f1piiq.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <RecordsProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/who-we-are" element={<WhoWeAre />} />
              <Route path="/who-we-are/about-us" element={<AboutUs />} />
              <Route path="/who-we-are/management-team" element={<ManagementTeam />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/get-involved/records" element={<CountyPage />} />
              <Route path="/get-involved/donate" element={<Donate />} />
              <Route path="/contact" element={<Contactus />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/records" element={<CountyPage />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/county/:county/bar_graph" element={<CountyBarGraph />} />
              <Route path="/management-team" element={<ManagementTeam />} />
            </Routes>
            <Footer />
          </Router>
        </RecordsProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}