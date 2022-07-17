const express = require("express");
const router = express.Router();
const { setRank } = require("../controllers/setRank");

router.post("/", setRank);

module.exports = router;
