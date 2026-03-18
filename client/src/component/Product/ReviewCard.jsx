import Rating from "@mui/material/Rating";
import "./ReviewCard.css";
const ReviewCard = ({ review, user, onRemove }) => {
  return (
    <div className="reviewCard">
      <Rating value={review.rating} readOnly precision={0.5} />

      <p className="reviewUser">{review.name}</p>

      <span className="reviewComment">{review.comment}</span>

      {user && review.user === user._id && (
        <button
          className="removeReviewBtn"
          onClick={() => onRemove(review._id)}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
