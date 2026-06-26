const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createInvestorRequest,
  investorShowInterest,
  getRequestsForInvestor,
  getRequestsForFounder,
  getStatusesForStartup,
  getMyStatus,
  acceptInvestorRequest,
  rejectInvestorRequest
} = require("../controllers/investorRequestController");

router.post("/", authMiddleware, createInvestorRequest);
router.post("/interest", authMiddleware, investorShowInterest);

router.get("/my-status/:startupId", authMiddleware, getMyStatus);
router.get("/investor/:investorId", authMiddleware, getRequestsForInvestor);
router.get("/founder/:founderId", authMiddleware, getRequestsForFounder);
router.get("/statuses/startup/:startupId", authMiddleware, getStatusesForStartup);

router.put("/accept/:requestId", authMiddleware, acceptInvestorRequest);
router.put("/reject/:requestId", authMiddleware, rejectInvestorRequest);

module.exports = router;