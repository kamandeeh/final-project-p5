import React from "react";


const Reviews = () => {
  const reviews = [
    {
      name: "John Doe",
      text: "This organization has truly changed lives. The impact is visible and meaningful.",
      rating: 5,
      image: "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid",
    },
    {
      name: "Jane Smith",
      text: "A great initiative! I highly recommend getting involved with their programs.",
      rating: 4,
      image: "https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid",
    },
    {
      name: "Michael Johnson",
      text: "Amazing efforts towards poverty eradication. The team is doing incredible work!",
      rating: 5,
      image: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?ga=GA1.1.1934715802.1740389877&semt=ais_hybrid",
    },
  ];

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">What People Say About Us</h2>
      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <img src={review.image} alt={review.name} className="review-avatar" />
              <h3>{review.name}</h3>
            </div>
            <p className="review-text">{review.text}</p>
            <p className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
