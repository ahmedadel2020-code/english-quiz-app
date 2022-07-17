const { scoresList } = require("../utils/TestData.json");

// @desc    Set Rank
// @route   POST /api/rank
// @access  Private
const setRank = (req, res) => {
  if (!req.body.score) {
    res.status(400);
    throw new Error("Please add a score field");
  }

  const score = req.body.score;
  let scoreBelow = 0;

  for (let i = 0; i < scoresList.length; i++) {
    if (scoresList[i] < score) {
      scoreBelow++;
    }
  }

  const rank = ((scoreBelow / scoresList.length) * 100).toFixed(2);

  res.status(200).json({ rank });
};

module.exports = {
  setRank,
};
