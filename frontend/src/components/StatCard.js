function StatCard({ title, value }) {
  return (
    <div className="card clickable-card">
      <p className="muted">{title}</p>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;