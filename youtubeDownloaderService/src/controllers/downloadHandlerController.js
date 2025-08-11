const YouTubeService = require("../services/youtubeDownloaderService.js");

const ytService = new YouTubeService();

exports.downloadHandler = async (req, res) => {
  const url = req.query.url;
  const type = req.query.isAudioOnly === "true" ? "mp3" : "mp4";

  if (!url) return res.status(400).send("Missing ?url=");

  try {
    await ytService.handleDownload(url, type, req, res);
  } catch (err) {
    console.error("DownloadHandler Error:", err);
    res.status(500).send("Something went wrong");
  }
};
