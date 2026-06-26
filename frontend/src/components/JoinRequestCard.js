import API from "../services/api";

function JoinRequestCard({ request, refresh }) {
  const acceptRequest = async () => {
    try {
      await API.put(`/join-requests/accept/${request._id}`);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectRequest = async () => {
    try {
      await API.put(`/join-requests/reject/${request._id}`);
      refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card clickable-card">
      <h4>
        {request.professional?.name}
        {request.professional?.verified && (
          <span className="verified-badge">Verified</span>
        )}
      </h4>

      <p className="muted">{request.professional?.email}</p>
      <p style={{ margin: "10px 0" }}>{request.message}</p>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
        Upvotes: {request.upVotes} &nbsp;&nbsp; Downvotes: {request.downVotes}
      </p>

      {request.status === "pending" ? (
        <div style={{ marginTop: "12px" }}>
          <button
            className="btn btn-primary"
            onClick={acceptRequest}
            style={{ marginRight: "10px" }}
          >
            Accept
          </button>

          <button className="btn btn-secondary" onClick={rejectRequest}>
            Reject
          </button>
        </div>
      ) : (
        <p style={{ marginTop: "12px" }}>
          <strong>Status:</strong> {request.status}
        </p>
      )}
    </div>
  );
}

export default JoinRequestCard;