import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function FounderMentorRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [requests, setRequests] = useState([]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await API.get(`/mentor-requests/founder/${user._id}`);
      setRequests(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    }
  }, [user._id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Your Mentor Requests</h1>
        <p className="page-subtitle">
          Track review and mentorship requests sent to mentors.
        </p>

        {requests.length === 0 ? (
          <p className="muted">No mentor requests sent yet.</p>
        ) : (
          <div className="grid grid-2">
            {requests.map((request) => (
              <div className="card clickable-card" key={request._id}>
                <h3>{request.startup?.title}</h3>
                <p>
                  <strong>Mentor:</strong> {request.mentor?.name}
                  {request.mentor?.verified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </p>
                <p><strong>Type:</strong> {request.requestType}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p style={{ marginTop: "10px" }}>
                  <strong>Message:</strong> {request.message || "No message"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FounderMentorRequests;