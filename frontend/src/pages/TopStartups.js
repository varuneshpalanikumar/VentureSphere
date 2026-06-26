import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function TopStartups() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    fetchTopStartups();
  }, []);

  const fetchTopStartups = async () => {
    try {
      const res = await API.get("/startups/all");
      const sortedStartups = [...(res.data.data || res.data)].sort((a, b) => {
        const scoreA = a.aiEvaluation?.aiScore ?? a.aiScore ?? -1;
        const scoreB = b.aiEvaluation?.aiScore ?? b.aiScore ?? -1;
        if (scoreB === scoreA) {
          return (b.startupScore || 0) - (a.startupScore || 0);
        }
        return scoreB - scoreA;
      });
      setStartups(sortedStartups);
    } catch (error) {
      console.error(error);
    }
  };

  const getRankLabel = (index) => {
    return `#${index + 1}`;
  };

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="page-title">Top Ventures</h1>
        <p className="page-subtitle">
          Ranked by AI Venture Score to help investors discover promising ventures.
        </p>

        {startups.length === 0 ? (
          <p className="muted">No ventures available yet.</p>
        ) : (
          <div className="grid grid-2">
            {startups.map((startup, index) => (
              <div className="card clickable-card" key={startup._id}>
                <p
                  style={{
                    color: "var(--primary)",
                    fontWeight: "700",
                    marginBottom: "10px"
                  }}
                >
                  {getRankLabel(index)}
                </p>

                <h3>{startup.title}</h3>

                <p className="muted" style={{ margin: "10px 0 14px" }}>
                  {startup.description}
                </p>

                <p>
                  <strong>Founder:</strong> {startup.founder?.name || "Unknown"}
                </p>

                <p>
                  <strong>AI Venture Score:</strong> {(startup.aiEvaluation?.aiScore ?? startup.aiScore) != null ? Math.round(startup.aiEvaluation?.aiScore ?? startup.aiScore) : "Not Evaluated"}
                </p>

                <p>
                  <strong>Progress:</strong> {startup.progress}%
                </p>

                <p>
                  <strong>Funding Required:</strong> ${startup.fundingRequired}
                </p>

                <div style={{ marginTop: "16px" }}>
                  <Link to={`/startup/${startup._id}`}>
                    <button className="btn btn-primary">
                      View Portfolio
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TopStartups;