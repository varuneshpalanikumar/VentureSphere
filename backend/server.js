require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const startupRoutes = require("./routes/startupRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const userRoutes = require("./routes/userRoutes");
const mentorRequestRoutes = require("./routes/mentorRequestRoutes");
const investorRequestRoutes = require("./routes/investorRequestRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/join-requests", joinRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentor-requests", mentorRequestRoutes);
app.use("/api/investor-requests", investorRequestRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/ai", aiRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
});