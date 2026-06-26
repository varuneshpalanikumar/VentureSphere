function UserInfoModal({ user, onClose }) {
  if (!user) return null;

  const portfolioLink =
    user.portfolio && user.portfolio.startsWith("http")
      ? user.portfolio
      : user.portfolio
      ? `https://${user.portfolio}`
      : "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 style={{display:"flex",alignItems:"center",gap:"10px"}}>
  {user.name}

  <span className={`role-badge role-${user.role}`}>
    {user.role}
  </span>

  {user.verified && (
    <span className="verified-badge">Verified</span>
  )}
</h2>
        <p>
          <strong>Email:</strong> {user.email || "Not available"}
        </p>

        <div style={{ marginTop: "10px" }}>
  <strong>Bio:</strong>
  <p className="muted" style={{ marginTop: "6px" }}>
    {user.bio || "No bio provided"}
  </p>
</div>

        {user.skills && user.skills.length > 0 && (
          <p style={{ marginTop: "10px" }}>
            <strong>Skills:</strong> {user.skills.join(", ")}
          </p>
        )}

        {portfolioLink && (
          <p style={{ marginTop: "10px" }}>
            <strong>Portfolio:</strong>{" "}
            <a href={portfolioLink} target="_blank" rel="noreferrer">
              View Profile
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default UserInfoModal;