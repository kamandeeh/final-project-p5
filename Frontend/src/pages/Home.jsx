import React from "react";

const Home = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center vh-100">
        <div className="content">
          <h1 className="display-4 fw-bold">Welcome to BLAH Foundation</h1>
          <p className="fs-4 mt-3">Empowering Communities for a Better Tomorrow</p>
          <button className="btn btn-warning btn-lg mt-4" onClick={scrollToAbout}>
            Learn More
          </button>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="about-section" className="container my-5">
        <h2 className="text-center fw-bold mb-4">What We Do</h2>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVkdWNhdGlvbiUyMHN1cHBvcnQlMjBhZnJpY2F8ZW58MHx8MHx8fDA%3D"
                className="card-img-top"
                alt="Education Support"
              />
              <div className="card-body">
                <h5 className="card-title">Education Support</h5>
                <p className="card-text">
                  We provide scholarships and educational resources to children in need.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGVhbHRoY2FyZXxlbnwwfHwwfHx8MA%3D%3D"
                className="card-img-top"
                alt="Healthcare Programs"
              />
              <div className="card-body">
                <h5 className="card-title">Healthcare Programs</h5>
                <p className="card-text">
                  Our foundation ensures access to medical care and essential health services.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvbW11bml0eSUyMGRldmVsb3BtZW50fGVufDB8fDB8fHww"
                className="card-img-top"
                alt="Community Development"
              />
              <div className="card-body">
                <h5 className="card-title">Community Development</h5>
                <p className="card-text">
                  We empower communities through skill development and social integration programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
