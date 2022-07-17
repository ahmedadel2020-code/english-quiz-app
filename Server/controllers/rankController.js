// @desc    Set Rank
// @route   POST /api/rank
// @access  Private
const setRank = (req, res) => {
  if (!req.body.score) {
    res.status(400);
    throw new Error("Please add a rank field");
  }

  const score = req.body.score;

  res.status(200).json({ rank: score });
};

module.exports = {
  setRank,
};
