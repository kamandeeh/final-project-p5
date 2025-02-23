import React from "react";
import "./Homepage.css";

const Home = () => {
  return (
    <div className="homepage">
      <header className="hero">
        <div className="hero-content text-black">
          <h1>Welcome to BLAH Foundation</h1>
          <p>Making a difference, one step at a time.</p>
          <button className="cta-btn">Get Involved</button>
        </div>
      </header>

      {/* What We Do Section */}
      <section className="what-we-do">
        <h2>What We Do</h2>
        <div className="card-container">
          <div className="card">
            <img src="https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/83/f3/c0/dd/74/v1_E10/E1029C9X.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=79e7b6fe22ab68b32701b1e28de9ff2891308c929e95454272d10a30903a611d" alt="Education" />
            <h3>Education for All</h3>
            <p>Providing access to quality education for underprivileged children.</p>
          </div>
          
          <div className="card">
            <img src="https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/1d/e3/9e/37/3b/v1_E11/E114K9CT.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=ecd18c3f879b216d50e42e55eddae3b9a74ae210fa792ff23c271b2895b3d2fd" alt="Healthcare" />
            <h3>Healthcare Initiatives</h3>
            <p>Ensuring medical support and health awareness programs.</p>
          </div>
          
          <div className="card">
            <img src="https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/c7/89/e3/48/56/v1_E10/E109PPBK.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=4c462c31e85dac16ba38d3c95c5915cd632d12ceda60a7d917631aaa1da9e9f8" alt="Food Assistance" />
            <h3>Food Assistance</h3>
            <p>Distributing meals to those in need to fight hunger.</p>
          </div>
          
          <div className="card">
            <img src="https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/df/08/f9/f4/93/v1_E10/E1091ZP9.jpg?w=800&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=491da2df53e437ee8aa13b2193c7338b974ca48dc502712ba77f6ee18d818b0a" alt="Empowerment" />
            <h3>Community Empowerment</h3>
            <p>Helping people become self-sufficient through skill development.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
