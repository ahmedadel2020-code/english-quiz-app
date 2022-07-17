const express = require("express");
const router = express.Router();
const { setRank } = require("../controllers/rankController");

router.post("/", setRank);

module.exports = router;
