import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div className="hero-section">
        <div className="hero-content">
          <img
            src="/logo.png"
            alt="VentureSphere Logo"
            className="hero-logo"
          />

          <h1>The Platform Where Ideas Become Ventures</h1>

          <p className="hero-subtitle">
            Connect founders, mentors, professionals, and investors through one collaborative ecosystem for building, validating, and growing ventures.
          </p>

          <div className="action-row">
            <Link to="/login">
              <button className="btn btn-primary">Launch Venture</button>
            </Link>

            <Link to="/signup">
              <button className="btn btn-secondary">Explore Ventures</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="home-content-section">
        <div className="home-content-inner">
          
          <div className="section-header">
            <h2>Designed for the Entire Ecosystem</h2>
            <p>Empowering everyone in the startup journey to collaborate, build, and succeed.</p>
          </div>
          
          <div className="grid grid-4 mb-5">
            <div className="card role-card">
              <h3>Founders</h3>
              <p>
                Build ventures, form teams, manage progress, and connect with mentors and investors.
              </p>
            </div>

            <div className="card role-card">
              <h3>Mentors</h3>
              <p>
                Guide founders, review ventures, and contribute expertise.
              </p>
            </div>

            <div className="card role-card">
              <h3>Professionals</h3>
              <p>
                Join ventures, collaborate on projects, and contribute specialized skills.
              </p>
            </div>

            <div className="card role-card">
              <h3>Investors</h3>
              <p>
                Discover promising ventures and connect with founders.
              </p>
            </div>
          </div>

          <div className="section-header mt-5">
            <h2>Platform Capabilities</h2>
            <p>A comprehensive toolkit built to streamline venture creation, assessment, and growth.</p>
          </div>

          <div className="grid grid-3 mb-5">
            <div className="card feature-card">
              <h4>AI Venture Evaluation</h4>
              <p className="muted">
                Evaluate venture readiness and receive structured feedback.
              </p>
            </div>

            <div className="card feature-card">
              <h4>Mentor Collaboration</h4>
              <p className="muted">
                Connect founders with experienced mentors.
              </p>
            </div>

            <div className="card feature-card">
              <h4>Investor Discovery</h4>
              <p className="muted">
                Enable investors to discover promising ventures.
              </p>
            </div>

            <div className="card feature-card">
              <h4>Team Formation</h4>
              <p className="muted">
                Build strong venture teams.
              </p>
            </div>

            <div className="card feature-card">
              <h4>Venture Portfolio Management</h4>
              <p className="muted">
                Manage venture information and progress.
              </p>
            </div>

            <div className="card feature-card">
              <h4>Role-Based Dashboards</h4>
              <p className="muted">
                Tailored experiences for different user roles.
              </p>
            </div>
          </div>

          <div className="section-header mt-5">
            <h2>Why VentureSphere</h2>
            <p>From spark to scale, we support every phase of the startup lifecycle.</p>
          </div>

          <div className="grid grid-4 mb-5">
            <div className="card value-card">
              <span className="value-number">01</span>
              <h4>Build</h4>
              <p className="muted">
                Transform ideas into ventures.
              </p>
            </div>

            <div className="card value-card">
              <span className="value-number">02</span>
              <h4>Validate</h4>
              <p className="muted">
                Receive mentorship and AI-driven insights.
              </p>
            </div>

            <div className="card value-card">
              <span className="value-number">03</span>
              <h4>Grow</h4>
              <p className="muted">
                Collaborate with professionals and investors.
              </p>
            </div>

            <div className="card value-card">
              <span className="value-number">04</span>
              <h4>Scale</h4>
              <p className="muted">
                Build long-term venture success.
              </p>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default Home;