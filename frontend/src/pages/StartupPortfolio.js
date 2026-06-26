import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import ReviewCard from "../components/ReviewCard";
import StatCard from "../components/StatCard";
import Navbar from "../components/Navbar";
import UserInfoModal from "../components/UserInfoModal";

function StartupPortfolio() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  const [joinStatus, setJoinStatus] = useState("none");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: "",
    comment: ""
  });

  const [progressForm, setProgressForm] = useState({
    progress: "",
    latestUpdate: ""
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [evaluation, setEvaluation] = useState(undefined);
  const [evalLoading, setEvalLoading] = useState(false);
  const [investorInterestStatus, setInvestorInterestStatus] = useState(null);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    fetchStartupDetails(storedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showMessage = (text, error = false) => {
    setIsError(error);
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const fetchStartupDetails = async (currentUser = user) => {
    try {
      if (currentUser?.role === "professional") {
        try {

          const res = await API.get(
            `/join-requests/status/${id}/${currentUser._id}`
          );

          setJoinStatus(res.data.status);

        } catch (error) {
        }
}
      if (currentUser?.role === "investor") {
        try {
          const statusRes = await API.get(`/investor-requests/my-status/${id}`);
          setInvestorInterestStatus(statusRes.data.data || null);
        } catch (err) {
        }
      }
      const res = await API.get(`/startups/details/${id}`);
      setData(res.data);

      try {
        setEvalLoading(true);
        const evalRes = await API.get(`/ai/evaluation/${id}`);
        setEvaluation(evalRes.data.data);
      } catch (error) {
        setEvaluation(null);
      } finally {
        setEvalLoading(false);
      }

      setProgressForm({
        progress: "",
        latestUpdate: ""
      });
    } catch (error) {
    }
  };

  const handleReviewChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "rating") {
      if (value === "") {
        setReviewForm({
          ...reviewForm,
          rating: value
        });
        return;
      }

      value = Number(value);

      if (value > 5) value = 5;
      if (value < 1) value = 1;
    }

    setReviewForm({
      ...reviewForm,
      [e.target.name]: value
    });
  };

  const handleProgressChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "progress") {
      value = Math.min(100, Math.max(0, value));
    }

    setProgressForm({
      ...progressForm,
      [e.target.name]: value
    });
  };

  const submitReview = async () => {
    if (!user) return;

    try {
      const res = await API.post("/reviews/add", {
        startupId: id,
        mentorId: user._id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });

      setIsError(false);
      setMessage(res.data?.message || "Review submitted successfully");

      setReviewForm({
        rating: "",
        comment: ""
      });

      fetchStartupDetails();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {

      setIsError(true);
      setMessage(
        error.response?.data?.message || "Failed to submit review"
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const updateProgress = async () => {
    try {
      await API.put(`/startups/progress/${id}`, {
        progress: Number(progressForm.progress),
        latestUpdate: progressForm.latestUpdate
      });

      await API.get(`/startups/score/${id}`);
      fetchStartupDetails();

      setSuccessMsg("Venture progress updated successfully");
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);

      setErrorMsg("");
    } catch (error) {
      setErrorMsg("Failed to update progress");
      setSuccessMsg("");

      setTimeout(() => {
        setErrorMsg("");
      }, 2000);
    }
  };

  const requestJoin = async () => {
    if (!user) return;

    try {
      const res = await API.post("/join-requests", {
        startupId: id,
        professionalId: user._id,
        message: "I would like to contribute to this venture."
      });
      setJoinStatus("pending");
      showMessage(res.data?.message || "Join request sent successfully");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to send join request",
        true
      );
    }
  };

  const showInterest = async () => {
    if (!user || isSubmittingInterest) return;

    setIsSubmittingInterest(true);
    try {
      const res = await API.post("/investor-requests/interest", {
        startupId: id,
        investorId: user._id,
        message: "I am interested in funding this venture."
      });

      setInvestorInterestStatus({ status: "pending", initiatedBy: "investor" });
      showMessage(res.data?.message || "Interest sent successfully");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to show interest",
        true
      );
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  if (!data) {
    return <div className="page-container">Loading venture portfolio...</div>;
  }

  const { startup, reviews } = data;
  const investorCount = startup.investorsInterested?.length || 0;
  const teamSize = (startup.professionalsJoined?.length || 0) + 1;
  const professionalAlreadyJoined =
  user?.role === "professional" &&
  startup.professionalsJoined?.some(
    (professional) => professional._id === user._id
  );
  const isStartupOwner =
  user?.role === "founder" &&
  startup?.founder?._id === user?._id;

  const investorAlreadyLinked =
    user?.role === "investor" &&
    startup.investorsInterested?.some(
      (investor) => investor._id === user._id
    );

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">{startup.title}</h1>
        <p className="page-subtitle">
          Founded by {startup.founder?.name || "Unknown Founder"}
        </p>

        {message && (
  <div className="floating-alert">
    <div className={isError ? "alert-error" : "alert-success"}>
      {message}
    </div>
  </div>
)}

        <div className="card clickable-card" style={{ marginBottom: "20px" }}>
          <p><strong>Description:</strong> {startup.description}</p>
          <p style={{ marginTop: "12px" }}>
            <strong>Latest Update:</strong> {startup.latestUpdate || "No updates yet"}
          </p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: "24px" }}>
          <StatCard title="Progress" value={`${startup.progress}%`} />
          <StatCard title="Investors Interested" value={investorCount} />
          <StatCard title="Team Size" value={teamSize} />
          <StatCard title="Funding Required" value={`₹${startup.fundingRequired}`} />
        </div>

        <p className="muted" style={{ marginBottom: "16px" }}>
          Click any joined profile card below to view contact details.
        </p>

        <h2 className="section-title">Mentors Joined</h2>

        <div className="grid grid-2" style={{ marginBottom: "24px" }}>
          {startup.mentorsJoined && startup.mentorsJoined.length > 0 ? (
            startup.mentorsJoined.map((mentor) => (
              <div
                className="card clickable-card"
                key={mentor._id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(mentor)}
              >
                <h4>
                  {mentor.name}
                  {mentor.verified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </h4>

                <p className="muted">{mentor.email}</p>
              </div>
            ))
          ) : (
            <p className="muted">No mentors joined yet.</p>
          )}
        </div>

        <h2 className="section-title">Professionals Joined</h2>

        <div className="grid grid-2" style={{ marginBottom: "24px" }}>
          {startup.professionalsJoined && startup.professionalsJoined.length > 0 ? (
            startup.professionalsJoined.map((professional) => (
              <div
                className="card clickable-card"
                key={professional._id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(professional)}
              >
                <h4>
                  {professional.name}
                  {professional.verified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </h4>

                <p className="muted">{professional.email}</p>
              </div>
            ))
          ) : (
            <p className="muted">No professionals joined yet.</p>
          )}
        </div>

        <h2 className="section-title">Investors Interested</h2>

        <div className="grid grid-2" style={{ marginBottom: "24px" }}>
          {startup.investorsInterested && startup.investorsInterested.length > 0 ? (
            startup.investorsInterested.map((investor) => (
              <div
                className="card clickable-card"
                key={investor._id}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedUser(investor)}
              >
                <h4>
                  {investor.name}
                  {investor.verified && (
                    <span className="verified-badge">Verified</span>
                  )}
                </h4>

                <p className="muted">{investor.email}</p>
              </div>
            ))
          ) : (
            <p className="muted">No investors linked yet.</p>
          )}
        </div>

        {}
        <div className="card clickable-card" style={{ marginBottom: "24px", borderLeft: '4px solid var(--primary)' }}>
          <h3 className="section-title">AI Venture Evaluation Summary</h3>
          {evalLoading ? (
            <p>Loading AI evaluation...</p>
          ) : evaluation ? (
            <>
              <p style={{ marginBottom: '8px' }}><strong>AI Venture Score:</strong> <span className="verified-badge" style={{ marginLeft: '4px' }}>{Math.round(evaluation.aiScore)}/100</span></p>
              <p style={{ marginBottom: '8px' }}><strong>Funding Readiness:</strong> {evaluation.fundingReadiness}</p>
              <p style={{ marginBottom: '16px' }}><strong>Investment Verdict:</strong> {evaluation.investmentVerdict}</p>
              {isStartupOwner && (
                <Link to={`/startup/${startup._id}/advisor`}>
                  <button className="btn btn-secondary" style={{ marginTop: '16px' }}>View Full AI Analysis</button>
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="muted" style={{ marginBottom: '16px' }}>No AI evaluation generated yet.</p>
              {isStartupOwner && (
                <Link to={`/startup/${startup._id}/advisor`}>
                  <button className="btn btn-primary">Get AI Analysis</button>
                </Link>
              )}
            </>
          )}
        </div>

        {isStartupOwner && (
          <div className="card clickable-card" style={{ marginBottom: "24px" }}>
            <h3 className="section-title">Update Progress</h3>

            <div className="input-group">
              <label>Progress (%)</label>
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={progressForm.progress}
                onChange={handleProgressChange}
              />
            </div>

            <div className="input-group">
              <label>Latest Update</label>
              <textarea
                name="latestUpdate"
                value={progressForm.latestUpdate}
                onChange={handleProgressChange}
              />
            </div>

            {successMsg && <div className="alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert-error">{errorMsg}</div>}

            <button className="btn btn-primary" onClick={updateProgress}>
              Save Progress
            </button>

            <Link to={`/startup/${startup._id}/requests`}>
              <button className="btn btn-secondary" style={{ marginLeft: "10px" }}>
                View Join Requests
              </button>
            </Link>
          </div>
        )}

        {user?.role === "mentor" && (
  <div className="card clickable-card" style={{ marginBottom: "24px" }}>
    <h3 className="section-title">Mentor Review</h3>

    {!startup.mentorReviewRequested ? (
      <div className="alert-error">
        This venture is not requesting mentor reviews.
      </div>
    ) : (
      <>
        <div className="input-group">
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={reviewForm.rating}
            onChange={handleReviewChange}
          />
        </div>

        <div className="input-group">
          <label>Comment</label>
          <textarea
            name="comment"
            value={reviewForm.comment}
            onChange={handleReviewChange}
          />
        </div>

        <button className="btn btn-primary" onClick={submitReview}>
          Submit Review
        </button>
      </>
    )}
  </div>
)}

        {user?.role === "professional" && (
  <div className="card clickable-card" style={{ marginBottom: "24px" }}>
    <h3 className="section-title">Join This Venture</h3>

    {!startup.techSupportRequired ? (
      <div className="alert-error">
        This venture is not currently looking for technical professionals.
      </div>
    ) : professionalAlreadyJoined ? (
      <div className="alert-success">
        You are already part of this venture team.
      </div>
    ) : joinStatus === "none" ? (
      <>
        <p className="muted" style={{ marginBottom: "12px" }}>
          Request to join and contribute your technical skills.
        </p>

        <button className="btn btn-primary" onClick={requestJoin}>
          Request to Join
        </button>
      </>
    ) : joinStatus === "pending" ? (
      <div className="alert-success">
        Join request sent. Waiting for founder response.
      </div>
    ) : joinStatus === "rejected" ? (
      <div className="alert-error">
        Your join request was rejected.
      </div>
    ) : null}
  </div>
)}
       {user?.role === "investor" && (() => {
  const iStatus = investorInterestStatus?.status;
  const iBy = investorInterestStatus?.initiatedBy;

  if (startup.fundingRequired <= 0) {
    return (
      <div className="card clickable-card" style={{ marginBottom: "24px" }}>
        <h3 className="section-title">Investor Action</h3>
        <div className="alert-error">This venture is not currently seeking funding.</div>
      </div>
    );
  }

  if (investorAlreadyLinked) {
    return (
      <div className="card clickable-card" style={{ marginBottom: "24px" }}>
        <h3 className="section-title">Investor Action</h3>
        <p className="muted" style={{ marginBottom: "12px" }}>
          You are already connected to this venture through an accepted funding request.
        </p>
        <button className="btn btn-secondary" disabled>Funding Request Accepted</button>
      </div>
    );
  }

  if (iStatus === "rejected") {
    const msg = iBy === "investor"
      ? "The founder has declined your interest request for this venture. You cannot send another request."
      : "You declined the founder\u2019s funding request for this venture. You cannot send another request.";
    return (
      <div className="card clickable-card" style={{ marginBottom: "24px" }}>
        <h3 className="section-title">Investor Action</h3>
        <div className="alert-error">{msg}</div>
      </div>
    );
  }

  if (iStatus === "pending" && iBy === "investor") {
    return (
      <div className="card clickable-card" style={{ marginBottom: "24px" }}>
        <h3 className="section-title">Investor Action</h3>
        <div className="alert-success">
          You have already shown interest in this venture. Waiting for the founder\u2019s response.
        </div>
      </div>
    );
  }

  if (iStatus === "pending" && iBy === "founder") {
    return (
      <div className="card clickable-card" style={{ marginBottom: "24px" }}>
        <h3 className="section-title">Investor Action</h3>
        <div className="alert-success">
          The founder has sent you a funding request. Check your Funding Requests page to respond.
        </div>
      </div>
    );
  }

  return (
    <div className="card clickable-card" style={{ marginBottom: "24px" }}>
      <h3 className="section-title">Investor Action</h3>
      <p className="muted" style={{ marginBottom: "12px" }}>
        Show interest in this venture to support its growth.
      </p>
      <button
        className="btn btn-primary"
        onClick={showInterest}
        disabled={isSubmittingInterest}
      >
        {isSubmittingInterest ? "Sending..." : "Show Interest"}
      </button>
    </div>
  );
})()}

        <h2 className="section-title">Mentor Reviews</h2>

        <div className="grid grid-2">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <p className="muted">No mentor reviews yet.</p>
          )}
        </div>
      </div>

      <UserInfoModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}

export default StartupPortfolio;