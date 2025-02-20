// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left Section */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold">BLAH Company</h1>
          <p className="mt-2 text-gray-400">Join us in advocating for the rights of refugees.</p>
        </div>
        
        {/* Middle Section */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold">Get <span className="text-gray-400">in touch</span></h2>
        </div>
        
        {/* Right Section */}
        <div className="text-center md:text-right">
          <div className="mb-4">
            <h3 className="font-semibold">Social</h3>
            <div className="flex justify-center md:justify-end space-x-4 mt-2">
              <a href="#" className="text-white text-2xl">📘</a>
              <a href="#" className="text-white text-2xl">🐦</a>
              <a href="#" className="text-white text-2xl">📸</a>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Email</h3>
            <p className="text-gray-400">hello@reallygreatsite.com</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p className="text-gray-400">(123) 456-7890</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
