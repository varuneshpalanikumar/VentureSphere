import { Link } from "react-router-dom";

function ProfessionalDashboard() {
  return (
    <div className="grid grid-3">
      <div className="card clickable-card">
        <h3>Discover Ventures</h3>
        <p>Find ventures that need technical support.</p>
        <br></br>

        <Link to="/search-startups">
          <button className="btn btn-primary">
            Explore
          </button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Joined Projects</h3>
        <p>View ventures you joined.</p>
        <br></br>
<br></br>
        <Link to="/professional-projects">
          <button className="btn btn-secondary">
            View Projects
          </button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>Vote Join Requests</h3>
        <p>Vote on professional join requests.</p>
        <br></br>

        <Link to="/vote-requests">
          <button className="btn btn-secondary">
            Review
          </button>
        </Link>
      </div>

      <div className="card clickable-card">
        <h3>My Join Requests</h3>
        <p>Track the status of join requests you sent.</p>
        <br></br>

        <Link to="/my-join-requests">
          <button className="btn btn-secondary">
            View Status
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProfessionalDashboard;