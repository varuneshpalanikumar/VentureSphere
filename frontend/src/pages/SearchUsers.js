import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import UserInfoModal from "../components/UserInfoModal";

function SearchUsers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role") || "";

  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [founderStartups, setFounderStartups] = useState([]);
  const [selectedStartupByUser, setSelectedStartupByUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [mentorStatuses, setMentorStatuses] = useState({});
  const [investorStatuses, setInvestorStatuses] = useState({});

  const [filters, setFilters] = useState({
    role: roleFromUrl,
    skill: "",
    name: ""
  });

  const showMessage = (text, error = false) => {
    setIsError(error);
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStartupChange = async (userId, startupId) => {
    setSelectedStartupByUser((prev) => ({ ...prev, [userId]: startupId }));

    if (!startupId || loggedInUser?.role !== "founder") return;

    if (!mentorStatuses[startupId]) {
      try {
        const res = await API.get(`/mentor-requests/statuses/startup/${startupId}`);
        setMentorStatuses((prev) => ({ ...prev, [startupId]: res.data.data || {} }));
      } catch (e) {
      }
    }

    if (!investorStatuses[startupId]) {
      try {
        const res = await API.get(`/investor-requests/statuses/startup/${startupId}`);
        setInvestorStatuses((prev) => ({ ...prev, [startupId]: res.data.data || {} }));
      } catch (e) {
      }
    }
  };

  const searchUsers = async (customFilters = filters) => {
    try {
      const params = new URLSearchParams();
      if (customFilters.role) params.append("role", customFilters.role);
      if (customFilters.skill) params.append("skill", customFilters.skill);
      if (customFilters.name) params.append("name", customFilters.name);
      const res = await API.get(`/users/search?${params.toString()}`);
      setUsers(res.data.data || res.data);
    } catch (error) {
      showMessage("Failed to search users", true);
    }
  };

  const fetchFounderStartups = async () => {
    if (!loggedInUser || loggedInUser.role !== "founder") return;
    try {
      const res = await API.get(`/startups/founder/${loggedInUser._id}`);
      setFounderStartups(res.data.data || res.data);
    } catch (error) {
      showMessage("Failed to fetch your ventures", true);
    }
  };

  useEffect(() => {
    const initialFilters = { role: roleFromUrl, skill: "", name: "" };
    setFilters(initialFilters);
    searchUsers(initialFilters);
    fetchFounderStartups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFromUrl]);

  const getTitle = () => {
    if (filters.role === "mentor") return "Search Mentors";
    if (filters.role === "professional") return "Search Professionals";
    if (filters.role === "investor") return "Search Investors";
    return "Search Users";
  };

  const sendMentorRequest = async (mentorId, requestType) => {
    if (!loggedInUser || loggedInUser.role !== "founder") {
      showMessage("Only founders can send mentor requests", true);
      return;
    }
    const selectedStartupId = selectedStartupByUser[mentorId];
    if (!selectedStartupId) {
      showMessage("Please select one of your ventures first", true);
      return;
    }
    try {
      await API.post("/mentor-requests", {
        startupId: selectedStartupId,
        founderId: loggedInUser._id,
        mentorId,
        requestType,
        message:
          requestType === "review"
            ? "We would like your review on this venture."
            : "We would like mentorship support for this venture."
      });
      showMessage(
        requestType === "review"
          ? "Review request sent successfully"
          : "Mentorship request sent successfully"
      );
      setMentorStatuses((prev) => ({
        ...prev,
        [selectedStartupId]: {
          ...(prev[selectedStartupId] || {}),
          [`${mentorId}_${requestType}`]: "pending"
        }
      }));
    } catch (error) {
      showMessage(
        error.response?.data?.message || error.response?.data?.error || "Failed to send mentor request",
        true
      );
    }
  };

  const sendFundingRequest = async (investorId) => {
    if (!loggedInUser || loggedInUser.role !== "founder") {
      showMessage("Only founders can send funding requests", true);
      return;
    }
    const selectedStartupId = selectedStartupByUser[investorId];
    if (!selectedStartupId) {
      showMessage("Please select one of your ventures first", true);
      return;
    }
    try {
      await API.post("/investor-requests", {
        startupId: selectedStartupId,
        founderId: loggedInUser._id,
        investorId,
        message: "We would like to request funding support for this venture."
      });
      showMessage("Funding request sent successfully");
      setInvestorStatuses((prev) => ({
        ...prev,
        [selectedStartupId]: {
          ...(prev[selectedStartupId] || {}),
          [investorId]: { status: "pending", initiatedBy: "founder" }
        }
      }));
    } catch (error) {
      showMessage(
        error.response?.data?.message || error.response?.data?.error || "Failed to send funding request",
        true
      );
    }
  };

  const getMentorStatus = (userId, requestType) => {
    const startupId = selectedStartupByUser[userId];
    if (!startupId) return null;
    return (mentorStatuses[startupId] || {})[`${userId}_${requestType}`] || null;
  };

  const getInvestorStatus = (userId) => {
    const startupId = selectedStartupByUser[userId];
    if (!startupId) return null;
    const entry = (investorStatuses[startupId] || {})[userId];
    return entry?.status || null;
  };

  const renderStatusBadge = (status, rejectedMsg) => {
    if (status === "pending") {
      return (
        <div className="alert-success" style={{ marginTop: "8px", fontSize: "0.85rem" }}>
          ✓ Request sent — awaiting response
        </div>
      );
    }
    if (status === "accepted") {
      return (
        <div className="alert-success" style={{ marginTop: "8px", fontSize: "0.85rem" }}>
          ✓ Request accepted
        </div>
      );
    }
    if (status === "rejected") {
      return (
        <div className="alert-error" style={{ marginTop: "8px", fontSize: "0.85rem" }}>
          ✗ {rejectedMsg || "Request was rejected. You cannot send another request."}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">{getTitle()}</h1>
        <br />
        {message && (
          <div className="floating-alert">
            <div className={isError ? "alert-error" : "alert-success"}>
              {message}
            </div>
          </div>
        )}
        <br />

        <div className="card clickable-card" style={{ marginBottom: "20px" }}>
          <div className="grid grid-3">
            <div className="input-group">
              <label>Role</label>
              <select name="role" value={filters.role} onChange={handleChange}>
                <option value="">Any</option>
                <option value="mentor">Mentor</option>
                <option value="professional">Professional</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            <div className="input-group">
              <label>Skill</label>
              <input name="skill" value={filters.skill} onChange={handleChange} placeholder="React" />
            </div>

            <div className="input-group">
              <label>Name</label>
              <input name="name" value={filters.name} onChange={handleChange} placeholder="Search name" />
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => searchUsers()}>
            Search
          </button>
        </div>

        <p className="muted" style={{ marginBottom: "14px" }}>
          Click any user card to view full details.
        </p>

        <div className="grid grid-3">
          {users.map((user) => {
            const isFounder = loggedInUser?.role === "founder";
            const showMentorActions = isFounder && user.role === "mentor";
            const showInvestorActions = isFounder && user.role === "investor";
            const selectedStartupId = selectedStartupByUser[user._id] || "";

            const reviewStatus = showMentorActions ? getMentorStatus(user._id, "review") : null;
            const mentorshipStatus = showMentorActions ? getMentorStatus(user._id, "mentorship") : null;
            const investorStatus = showInvestorActions ? getInvestorStatus(user._id) : null;

            return (
              <div
                className="card clickable-card"
                key={user._id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(user)}
              >
                <h3>
                  {user.name}
                  {user.verified && <span className="verified-badge">Verified</span>}
                </h3>

                <p className="muted">{user.role}</p>

                {user.skills && user.skills.length > 0 && (
                  <p><strong>Skills:</strong> {user.skills.join(", ")}</p>
                )}

                {user.portfolio && (
                  <p>
                    <strong>Portfolio:</strong>{" "}
                    <a
                      href={user.portfolio.startsWith("http") ? user.portfolio : `https://${user.portfolio}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </a>
                  </p>
                )}

                {(showMentorActions || showInvestorActions) && (
                  <div style={{ marginTop: "16px" }} onClick={(e) => e.stopPropagation()}>
                    {}
                    <div className="input-group">
                      <label>Select Venture</label>
                      <select
                        value={selectedStartupId}
                        onChange={(e) => handleStartupChange(user._id, e.target.value)}
                      >
                        <option value="">Choose venture</option>
                        {founderStartups.map((startup) => (
                          <option key={startup._id} value={startup._id}>
                            {startup.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {}
                    {showMentorActions && (
                      <div style={{ marginTop: "10px" }}>

                        {}
                        <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6 }}>Review Request</p>
                        {reviewStatus === null && (
                          <button
                            className="btn btn-primary"
                            style={{ marginRight: "10px" }}
                            onClick={() => sendMentorRequest(user._id, "review")}
                          >
                            Request Review
                          </button>
                        )}
                        {reviewStatus === "pending" && (
                          <div className="alert-success" style={{ fontSize: "0.85rem" }}>✓ Review request sent — awaiting response</div>
                        )}
                        {reviewStatus === "accepted" && (
                          <div className="alert-success" style={{ fontSize: "0.85rem" }}>✓ Review request accepted</div>
                        )}
                        {reviewStatus === "rejected" && (
                          <div className="alert-error" style={{ fontSize: "0.85rem" }}>✗ Review request rejected — you cannot send another</div>
                        )}

                        <div style={{ marginTop: "12px" }} />

                        {}
                        <p style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6 }}>Mentorship Request</p>
                        {mentorshipStatus === null && (
                          <button
                            className="btn btn-secondary"
                            onClick={() => sendMentorRequest(user._id, "mentorship")}
                          >
                            Request Mentorship
                          </button>
                        )}
                        {mentorshipStatus === "pending" && (
                          <div className="alert-success" style={{ fontSize: "0.85rem" }}>✓ Mentorship request sent — awaiting response</div>
                        )}
                        {mentorshipStatus === "accepted" && (
                          <div className="alert-success" style={{ fontSize: "0.85rem" }}>✓ Mentorship request accepted</div>
                        )}
                        {mentorshipStatus === "rejected" && (
                          <div className="alert-error" style={{ fontSize: "0.85rem" }}>✗ Mentorship request rejected — you cannot send another</div>
                        )}

                      </div>
                    )}

                    {}
                    {showInvestorActions && (
                      <div style={{ marginTop: "10px" }}>
                        {investorStatus === null && (
                          <button
                            className="btn btn-primary"
                            onClick={() => sendFundingRequest(user._id)}
                          >
                            Request Funding
                          </button>
                        )}
                        {renderStatusBadge(investorStatus, "This investor rejected your funding request. You cannot send another.")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <UserInfoModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}

export default SearchUsers;