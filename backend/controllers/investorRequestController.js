const InvestorRequest = require("../models/InvestorRequest");
const User = require("../models/User");
const Startup = require("../models/Startup");
const AppError = require("../utils/AppError");

exports.getStatusesForStartup = async (req, res, next) => {
  try {
    const requests = await InvestorRequest.find({ startup: req.params.startupId });
    const statusMap = {};
    requests.forEach((r) => {
      statusMap[r.investor.toString()] = {
        status: r.status,
        initiatedBy: r.initiatedBy
      };
    });
    res.json({ success: true, data: statusMap });
  } catch (error) {
    next(error);
  }
};

exports.getMyStatus = async (req, res, next) => {
  try {
    const request = await InvestorRequest.findOne({
      startup: req.params.startupId,
      investor: req.user.id
    });
    if (!request) {
      return res.json({ success: true, data: null });
    }
    res.json({
      success: true,
      data: { status: request.status, initiatedBy: request.initiatedBy }
    });
  } catch (error) {
    next(error);
  }
};

exports.createInvestorRequest = async (req, res, next) => {
  try {
    const { startupId, founderId, investorId, message } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const investor = await User.findById(investorId);

    if (!investor || investor.role !== "investor") {
      throw new AppError("Investor not found", 404, "NOT_FOUND");
    }

    const existingRequest = await InvestorRequest.findOne({
      startup: startupId,
      investor: investorId,
      requestType: "funding"
    });

    if (existingRequest) {
      if (existingRequest.status === "rejected") {
        throw new AppError(
          "This investor has already rejected your funding request. You cannot send another request to this investor for this venture.",
          400,
          "REQUEST_REJECTED"
        );
      }
      if (existingRequest.status === "accepted") {
        throw new AppError(
          "This investor has already accepted a funding request for this venture.",
          400,
          "REQUEST_ACCEPTED"
        );
      }
      throw new AppError(
        "A funding request has already been sent to this investor for this venture. Please wait for their response.",
        400,
        "DUPLICATE_REQUEST"
      );
    }

    const newRequest = new InvestorRequest({
      startup: startupId,
      founder: founderId,
      investor: investorId,
      requestType: "funding",
      initiatedBy: "founder",
      message: message || "We would like to request funding support for this startup."
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Funding request sent successfully",
      request: newRequest
    });
  } catch (error) {
    next(error);
  }
};

exports.investorShowInterest = async (req, res, next) => {
  try {
    const { startupId, investorId, message } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      throw new AppError("Startup not found", 404, "NOT_FOUND");
    }

    const investor = await User.findById(investorId);

    if (!investor || investor.role !== "investor") {
      throw new AppError("Investor not found", 404, "NOT_FOUND");
    }

    const existingRequest = await InvestorRequest.findOne({
      startup: startupId,
      investor: investorId,
      requestType: "funding"
    });

    if (existingRequest) {
      if (existingRequest.status === "rejected") {
        throw new AppError(
          "The founder has already rejected your interest request for this venture. You cannot send another request.",
          400,
          "REQUEST_REJECTED"
        );
      }
      if (existingRequest.status === "accepted") {
        throw new AppError(
          "You are already connected to this venture through an accepted funding request.",
          400,
          "REQUEST_ACCEPTED"
        );
      }
      throw new AppError(
        "You have already shown interest in this venture. Please wait for the founder's response.",
        400,
        "DUPLICATE_REQUEST"
      );
    }

    const newRequest = new InvestorRequest({
      startup: startupId,
      founder: startup.founder,
      investor: investorId,
      requestType: "funding",
      initiatedBy: "investor",
      message: message || "Investor has shown interest in funding this startup."
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Interest sent successfully",
      request: newRequest
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequestsForInvestor = async (req, res, next) => {
  try {
    const requests = await InvestorRequest.find({
      investor: req.params.investorId,
      status: "pending",
      initiatedBy: "founder"
    })
      .populate("startup", "title description startupScore progress fundingRequired")
      .populate("founder", "name email")
      .populate("investor", "name email");

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.getRequestsForFounder = async (req, res, next) => {
  try {
    const requests = await InvestorRequest.find({
      founder: req.params.founderId
    })
      .populate("startup", "title description startupScore progress fundingRequired")
      .populate("investor", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.acceptInvestorRequest = async (req, res, next) => {
  try {
    const request = await InvestorRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Investor request not found", 404, "NOT_FOUND");
    }

    if (request.status === "accepted") {
      return res.json({
        success: true,
        message: "Request already accepted"
      });
    }

    if (request.status === "rejected") {
      throw new AppError("Rejected request cannot be accepted", 400, "INVALID_STATE");
    }

    request.status = "accepted";
    await request.save();

    await Startup.findByIdAndUpdate(request.startup, {
      $addToSet: { investorsInterested: request.investor }
    });

    res.json({
      success: true,
      message: "Investor successfully added to project"
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectInvestorRequest = async (req, res, next) => {
  try {
    const request = await InvestorRequest.findById(req.params.requestId);

    if (!request) {
      throw new AppError("Investor request not found", 404, "NOT_FOUND");
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Funding request rejected"
    });
  } catch (error) {
    next(error);
  }
};