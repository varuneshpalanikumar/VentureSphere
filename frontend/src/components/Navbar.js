import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="navbar-inner">
        

        <Link to={user ? "/dashboard" : "/"} className="brand">
          <img src="/logo.png" alt="VentureSphere Logo" className="brand-logo" />
          <span>VentureSphere</span>
        </Link>
        <div className="nav-links">
          <NavLink to={user ? "/dashboard" : "/"} end>
            Dashboard
          </NavLink>
          <NavLink to="/search-users">People</NavLink>
          <NavLink to="/search-startups">Explore Ventures</NavLink>
          <NavLink to="/top-startups">Leaderboard</NavLink>

          {user ? (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;