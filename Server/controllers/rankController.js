const asyncHandler = require("express-async-handler");

// @desc    Set Rank
// @route   POST /api/rank
// @access  Private
const setRank = asyncHandler(async (req, res) => {
  if (!req.body.rank) {
    res.status(400);
    throw new Error("Please add a rank field");
  }
  res.status(200).json({ message: "Set rank" });
});

module.exports = {
  setRank,
};
