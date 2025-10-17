const express = require("express");
const { getTranscript } = require("../controllers/transcriptController");

const router = express.Router();

router.get("/", getTranscript);

module.exports = router;
