const express = require("express");
const router = express.Router();
const { getWords } = require("../controllers/wordsController");

// if request our route will execute getWords function in our controller
router.get("/", getWords);

module.exports = router;
