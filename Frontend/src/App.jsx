import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/usercontext"; 
import Home from "./pages/Home";
import WhoWeAre from "./pages/WhoWeAre";
import Aboutus from "./pages/Aboutus";
import ManagementTeam from "./pages/ManagmentTeam";
import GetInvolved from "./pages/Getinvolved";
import Records from "./pages/Records";
import Donate from "./pages/Donate";
import Contactus from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/who-we-are/about-us" element={<Aboutus />} />
          <Route path="/who-we-are/management-team" element={<ManagementTeam />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/get-involved/records" element={<Records />} />
          <Route path="/get-involved/donate" element={<Donate />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/records" element={<Records />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/management-team" element={<ManagementTeam />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
