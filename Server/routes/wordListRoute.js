const express = require("express");
const router = express.Router();
const { getWordList } = require("../controllers/getWordList");

router.get("/", getWordList);

module.exports = router;
