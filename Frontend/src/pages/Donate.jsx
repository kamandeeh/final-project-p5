import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Donate = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleDonation = () => {
    if (mobileNumber.length === 10 && mobileNumber.startsWith("07")) {
      setConfirmationMessage("M-Pesa payment prompt sent to " + mobileNumber);
      // Here you should integrate an API call to M-Pesa STK push
    } else {
      setConfirmationMessage("Please enter a valid Kenyan mobile number.");
    }
  };

  // Image paths (ensure these are in `public/` folder)
  const images = [
    "/images/refugee-camp.jpg",
  "/images/helping-hands.jpg",
  "/images/community-support.jpg",
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Donate</h1>

      {/* Image Slider */}
      <Slider {...settings} className="w-full max-w-4xl mx-auto">
        {images.map((src, index) => (
          <div key={index} className="p-2">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </Slider>

      {/* Donation Options */}
      <ul className="mt-8">
        <li className="bg-gray-200 p-2 rounded mb-2">Donation Drive for Refugees</li>
        <li className="bg-gray-200 p-2 rounded mb-2">World Refugee Day Panel</li>
        <li className="bg-gray-200 p-2 rounded">Cultural Exchange Program</li>
      </ul>

      {/* M-Pesa Donation */}
      <div className="mt-8 bg-gray-100 rounded-lg shadow-md text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Donate via M-Pesa</h2>
        <input
          type="text"
          placeholder="Enter your mobile number"
          className="p-2 border rounded w-full"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button
          onClick={handleDonation}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Donate via M-Pesa
        </button>
        {confirmationMessage && <p className="mt-2 text-green-600">{confirmationMessage}</p>}
      </div>
    </div>
  );
};

export default Donate;
