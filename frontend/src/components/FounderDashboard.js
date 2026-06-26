import { Link } from "react-router-dom";

function FounderDashboard() {
  return (
    <div className="grid grid-3">
      <div className="card clickable-card">
        <h3>Launch Venture</h3>
        <p>Create and publish your venture idea.</p>
        <br></br>
        <Link to="/create-startup">
          <button className="btn btn-primary">Launch</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Search Mentors</h3>
        <p>Find mentors to review your venture.</p>
        <br></br>
        <Link to="/search-users?role=mentor">
          <button className="btn btn-secondary">Find Mentors</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Search Professionals</h3>
        <p>Find professionals to support your venture technically.</p>
        <br></br>
        <Link to="/search-users?role=professional">
          <button className="btn btn-secondary">Find Professionals</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Search Investors</h3>
        <p>Find investors interested in promising ventures.</p>
        <br></br>
        <Link to="/search-users?role=investor">
          <button className="btn btn-secondary">Find Investors</button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>View Ventures</h3>
        <p>Browse venture listings and portfolios.</p>
        <br></br>
        <Link to="/search-startups">
          <button className="btn btn-secondary">Explore</button>
        </Link>
      </div>
      <div className="card clickable-card">
      <h3>Mentor Requests</h3>
      <p>Track review and mentorship requests sent to mentors.</p>
<br></br>
      <Link to="/founder-mentor-requests">
      <button className="btn btn-secondary">View Requests</button>
      <br></br>
      </Link>
      </div>
      <div className="card clickable-card">
        <h3>Funding Requests</h3>
        <p>Track funding requests sent to investors.</p>
<br></br>
        <Link to="/founder-investor-requests">
          <button className="btn btn-secondary">
            View Requests
          </button>
        </Link>
      </div>
    </div>
  );
}

export default FounderDashboard;