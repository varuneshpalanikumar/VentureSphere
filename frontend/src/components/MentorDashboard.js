import { Link } from "react-router-dom";

function MentorDashboard() {
  return (
    <div className="grid grid-3">
      <div className="card clickable-card">
        <h3>Review Ventures</h3>
        <p>Browse ventures and provide reviews.</p>
<br></br>
        <Link to="/search-startups?mentorReviewRequested=true">
          <button className="btn btn-primary">Review</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Mentor Requests</h3>
        <p>See direct review and mentorship requests from founders.</p>
<br></br>
        <Link to="/mentor-requests">
          <button className="btn btn-secondary">View Requests</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>My Mentoring Ventures</h3>
        <p>View the ventures you are currently mentoring.</p>
<br></br>
        <Link to="/mentor-startups">
          <button className="btn btn-secondary">View Ventures</button>
        </Link>
      </div>
    </div>
  );
}

export default MentorDashboard;