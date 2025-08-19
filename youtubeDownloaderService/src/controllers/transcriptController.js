const TranscriptService = require("../services/transcriptService");

/**
 * GET /transcript?url=<youtube_url_or_id>&format=srt|txt&lang=en&as=download
 * Responds with text/plain (txt) or application/x-subrip (srt).
 * If as=download, sets Content-Disposition to attachment with a sensible name.
 */
exports.getTranscript = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing ?url=");

  const format = String(req.query.format).toLowerCase() === "srt" ? "srt" : "txt";

  try {
    const transcript = await TranscriptService.fetchTranscript(url, format);

    if (format === "srt") {
      res.setHeader("Content-Type", "application/x-subrip; charset=utf-8");
    } else {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }

    res.send(transcript);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).send(err.message || "Failed to fetch transcript");
  }
};
