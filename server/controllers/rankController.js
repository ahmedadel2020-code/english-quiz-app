const { scoresList } = require("../utils/TestData.json");

// @desc    Set Rank
// @route   POST /api/rank
// @access  Private
const setRank = (req, res) => {
  // if there is no score provided in the body will display error
  if (req.body.score === "") {
    res.status(400);
    throw new Error("Please add a score field");
  }

  const score = req.body.score;
  const ranks = [];

  // will count the number of scores below our user score
  let countScoresBelowUser = 0;
  if (score > 0) {
    for (let idx = 0; idx < scoresList.length; idx++) {
      if (scoresList[idx] < score) {
        countScoresBelowUser++;
      }
    }
  }

  // calculate user rank and if Rank is float number will make it to the nearest hundredth.
  const userRank = (countScoresBelowUser / scoresList.length) * 100;
  if (userRank % 1 !== 0) {
    const toFloat = userRank.toFixed(2);
    ranks.push(toFloat);
  } else {
    ranks.push(userRank);
  }

  // wil count the number of scores below each user
  for (let i = 0; i < scoresList.length; i++) {
    let countScoresOfOtherUsers = 0;
    for (let j = 0; j < scoresList.length; j++) {
      if (i === j) {
        continue;
      }
      if (scoresList[j] < scoresList[i]) {
        countScoresOfOtherUsers++;
      }
    }
    // calculate other users rank and if Rank is float number, will make it to the nearest hundredth
    const otherUsersRank = (countScoresOfOtherUsers / scoresList.length) * 100;
    if (otherUsersRank % 1 !== 0) {
      const toFloat = otherUsersRank.toFixed(2);
      ranks.push(toFloat);
    } else {
      ranks.push(otherUsersRank);
    }
  }
  res.status(200).json({ ranks });
};

module.exports = {
  setRank,
};
