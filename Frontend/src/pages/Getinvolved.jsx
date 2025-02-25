import React, { useState } from 'react';

const GetInvolved = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real-world application, you would send the data to a backend API here
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <section className="p-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-6">Get Involved</h2>

  {/* Introductory Text */}
  <p className="text-center text-lg text-gray-700 mb-8">
    Join us in the fight against poverty and inequality. Your involvement helps create lasting change in communities worldwide.
  </p>

  {/* Ways to Get Involved */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900">Volunteer</h3>
      <p className="text-gray-700">Help with our community initiatives and support local programs.</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900">Donate</h3>
      <p className="text-gray-700">Your donations provide essential resources to those in need.</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900">Job Opportunities</h3>
      <p className="text-gray-700">Work with us to create sustainable solutions for communities in need.</p>
    </div>
  </div>

  {/* Sign-Up Form */}
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-8">
    <h3 className="text-2xl font-semibold mb-4">Sign Up to Get Involved</h3>

    {/* Name Input */}
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      placeholder="Your Name"
      className="w-full p-3 mb-4 border rounded"
    />

    {/* Email Input */}
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      placeholder="Your Email"
      className="w-full p-3 mb-4 border rounded"
    />

    {/* Message Input */}
    <textarea
      name="message"
      value={formData.message}
      onChange={handleInputChange}
      placeholder="How would you like to get involved?"
      className="w-full p-3 mb-4 border rounded"
      rows="4"
    ></textarea>

    <button
      type="submit"
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
    >
      Submit
    </button>

    {/* Confirmation Message */}
    {submitted && (
      <p className="mt-4 text-center text-green-600">Thank you for getting involved! We will be in touch soon.</p>
    )}
  </form>

  {/* Testimonials Section */}
  <section className="bg-gray-100 p-8 mt-8">
    <h3 className="text-2xl font-semibold text-center">What Our Volunteers Are Saying</h3>
    <div className="flex justify-center gap-8 mt-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="italic text-gray-600">"Volunteering with this organization has changed my life. I feel like I am making a real impact on people's lives!"</p>
        <p className="text-right text-gray-800">- Sarah, Volunteer</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="italic text-gray-600">"I never knew how much of an impact I could have until I started volunteering. The work we do here really matters!"</p>
        <p className="text-right text-gray-800">- John, Volunteer</p>
      </div>
    </div>
  </section>

  {/* Contact Information Section */}
  <section className="text-center mt-12">
    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
    <p className="text-lg text-gray-700">Have questions about how to get involved? Reach out to us:</p>
    <p className="text-blue-500 mt-2">info@organization.com</p>
  </section>
</section>
  );
};

export default GetInvolved;

