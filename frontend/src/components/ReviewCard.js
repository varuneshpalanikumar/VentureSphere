function ReviewCard({ review }) {
  const mentor = review.mentor;

  return (
    <div className="card clickable-card">
      <h4>
        {mentor?.name || "Mentor"}

        {mentor?.verified && (
          <span className="verified-badge">Verified</span>
        )}
      </h4>

      <p style={{ margin: "8px 0" }}>
        <strong>Rating:</strong> {review.rating}/5
      </p>

      <p className="muted">{review.comment}</p>
    </div>
  );
}

export default ReviewCard;