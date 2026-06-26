import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import JoinRequestCard from "../components/JoinRequestCard";

function StartupRequests() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await API.get(`/join-requests/startup/${id}`);
      setRequests(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Join Requests</h1>
        <p className="page-subtitle">
          Review professional requests for this venture.
        </p>

        {requests.length === 0 ? (
          <p className="muted">No join requests yet.</p>
        ) : (
          <div className="grid grid-3">
            {requests.map((request) => (
              <JoinRequestCard
                key={request._id}
                request={request}
                refresh={fetchRequests}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StartupRequests;