const express = require("express");
const videoInfoController = require("../controllers/videoInfoController");
const YouTubeDownloadService = require("../services/youtubeDownloaderService");

const router = express.Router();

router.get("/", videoInfoController);

module.exports = router;
