import React from "react";
import Rating from "@mui/material/Rating";
import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  if (!review) return null;

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />

      <p>{review.name}</p>

      <Rating
        value={review.rating || 0}
        readOnly
        precision={0.5}
        size="small"
      />

      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
