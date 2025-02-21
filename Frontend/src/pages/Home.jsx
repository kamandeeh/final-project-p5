import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/images/refugee-camp.jpg",
  "/images/helping-hands.jpg",
  "/images/community-support.jpg",
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  fade: true,
};

const Home = () => {
  return (
    <div>
      {/* Hero Section with Moving Images */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-gradient-to-r from-blue-600 to-indigo-800 px-4 py-12">
        
        {/* Image Slider */}
        <div className="w-full max-w-4xl mx-auto">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Overlay & Text */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <h1 className="text-6xl font-extrabold z-10 relative">Welcome to BLAH Foundation</h1>
        <p className="text-xl mt-4 max-w-3xl mx-auto z-10 relative">
          Empowering Communities for a Better Tomorrow
        </p>
      </section>
    </div>
  );
};

export default Home;
