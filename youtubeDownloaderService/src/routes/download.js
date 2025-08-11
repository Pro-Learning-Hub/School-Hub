// src/routes/download.js
const express = require("express");
const { downloadHandler } = require("../controllers/downloadHandlerController");

const router = express.Router();
router.get("/", downloadHandler);

module.exports = router;
