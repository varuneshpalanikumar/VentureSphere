import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function VoteRequests() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchJoinedProjects = useCallback(async () => {
    try {
      const res = await API.get(`/users/${user._id}/joined-projects`);
      setProjects(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load joined ventures");
    }
  }, [user._id]);

  useEffect(() => {
    fetchJoinedProjects();
  }, [fetchJoinedProjects]);

  const loadRequestsForStartup = async (startup) => {
    try {
      setSelectedStartup(startup);

      const res = await API.get(`/join-requests/startup/${startup._id}`);
      setRequests(res.data.data || res.data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load join requests");
    }
  };

  const voteRequest = async (requestId, voteType) => {
    try {
      await API.put(`/join-requests/vote/${requestId}`, {
        voterId: user._id,
        voteType
      });

      if (selectedStartup) {
        loadRequestsForStartup(selectedStartup);
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to record vote"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Vote Join Requests</h1>
        <p className="page-subtitle">
          Review join requests from ventures you are part of.
        </p>

        {message && (
          <div className="alert-error">
            {message}
          </div>
        )}

        <h2 className="section-title">Your Joined Ventures</h2>

        {projects.length === 0 ? (
          <p className="muted">You haven't joined any ventures yet.</p>
        ) : (
          <div className="grid grid-3" style={{ marginBottom: "30px" }}>
            {projects.map((project) => (
              <div className="card clickable-card" key={project._id}>
                <h3>{project.title}</h3>
                <p className="muted" style={{ margin: "8px 0 12px" }}>
                  {project.description}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => loadRequestsForStartup(project)}
                >
                  View Join Requests
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedStartup && (
          <>
            <h2 className="section-title">
              Join Requests for {selectedStartup.title}
            </h2>

            {requests.length === 0 ? (
              <p className="muted">No join requests for this venture yet.</p>
            ) : (
              <div className="grid grid-3">
                {requests.map((request) => (
                  <div className="card clickable-card" key={request._id}>
                    <h3>
                      {request.professional?.name}
                      {request.professional?.verified && (
                        <span className="verified-badge">Verified</span>
                      )}
                    </h3>

                    <p className="muted">{request.professional?.email}</p>

                    <p style={{ margin: "10px 0" }}>{request.message}</p>

                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      Upvotes: {request.upVotes} &nbsp;&nbsp; Downvotes: {request.downVotes}
                    </p>

                    <p style={{ marginTop: "8px" }}>
                      <strong>Status:</strong> {request.status}
                    </p>

                    <div style={{ marginTop: "12px" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => voteRequest(request._id, "up")}
                        style={{ marginRight: "10px" }}
                      >
                        Upvote
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => voteRequest(request._id, "down")}
                      >
                        Downvote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default VoteRequests;