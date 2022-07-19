const express = require("express");
const router = express.Router();
const { getWords } = require("../controllers/wordsController");

router.get("/", getWords);

module.exports = router;
