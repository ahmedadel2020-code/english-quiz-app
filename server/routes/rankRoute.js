const express = require("express");
const router = express.Router();
const { setRank } = require("../controllers/rankController");

// if request our route will execute setRank function in our controller

router.post("/", setRank);

module.exports = router;
