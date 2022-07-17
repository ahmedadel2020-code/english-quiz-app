const express = require("express");
const router = express.Router();
const { getWordList } = require("../controllers/wordListController");

router.get("/", getWordList);

module.exports = router;
