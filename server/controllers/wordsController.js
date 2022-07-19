const { wordList } = require("../utils/TestData.json");

// @desc    Get goals
// @route   GET /api/wordList
// @access  Private

const getWords = (req, res) => {
  const randomWords = [...wordList]
    .sort(() => 0.5 - Math.random())
    .filter(
      (word) =>
        word.pos === "adjective" ||
        word.pos === "verb" ||
        word.pos === "adverb" ||
        word.pos === "noun"
    )
    .slice(0, 10);

  res.status(200).json({ wordList: randomWords });
};

module.exports = {
  getWords,
};
