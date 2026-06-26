import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "founder",
  skills: "",
  portfolio: "",
  bio: ""
});

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const payload = {
  name: form.name,
  email: form.email,
  password: form.password,
  role: form.role,
  portfolio: form.portfolio,
  bio: form.bio
};

      if (form.role === "professional") {
        payload.skills = form.skills.split(",").map(s => s.trim());
      }

      await API.post("/auth/signup", payload);

      setIsError(false);
      setMessage("Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {

      setIsError(true);

      setMessage(
        error.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div className="page-container">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate("/")}
        style={{ marginBottom: '24px' }}
      >
        &larr; Back to Home
      </button>

      <div className="card clickable-card" style={{maxWidth:"500px",margin:"40px auto"}}>

        <h2>Create Account</h2>
<br></br>
        {message && (
          <div className={isError ? "alert-error" : "alert-success"}>
            {message}
          </div>
        )}
<br></br>
        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
  <label>Password</label>

  <div className="password-field">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      required
    />

    <span
      className="toggle-password"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "Hide" : "Show"}
    </span>
  </div>

</div>

          <div className="input-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="founder">Founder</option>
              <option value="professional">Professional</option>
              <option value="mentor">Mentor</option>
              <option value="investor">Investor</option>
            </select>
          </div>

          {form.role === "professional" && (
            <div className="input-group">
              <label>Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node, AI"
              />
            </div>
          )}

          {(form.role === "professional" || form.role === "mentor") && (
            <div className="input-group">
              <label>Portfolio / LinkedIn</label>
              <input
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
              />
            </div>
          )}

          {form.role === "investor" && (
            <div className="input-group">
              <label>Investment Profile</label>
              <input
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                placeholder="Angel investor / VC"
              />
            </div>
          )}
<div className="input-group">
  <label>Bio</label>

  <textarea
    name="bio"
    value={form.bio}
    onChange={handleChange}
    placeholder="Tell others about yourself..."
    maxLength="300"
  />

  <small className="muted">
    {form.bio.length}/300 characters
  </small>
</div>
          <button className="btn btn-primary">
            Signup
          </button>

        </form>

        <p style={{marginTop:"15px"}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;