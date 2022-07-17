const asyncHandler = require("express-async-handler");

// @desc    Get goals
// @route   GET /api/wordList
// @access  Private
const getWordList = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get wordList" });
});

module.exports = {
  getWordList,
};
