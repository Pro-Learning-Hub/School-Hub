const YouTubeUtils = require("../utils/youtubeUtils");

require("dotenv").config();

module.exports = async function videoInfoHandler(req, res) {
	const url = req.query.url;
	if (!url) return res.status(400).send("Missing ?url=");
	
	try {
		const videoInfo = await YouTubeUtils.getVideoInfo(url);
		
		if (!videoInfo.videoId) {
			return res.status(400).send("Invalid YouTube URL");
		}
		
		if (!videoInfo.title) {
			return res.status(404).send("Video not found or title unavailable");
		}
		
		res.json({
			title: videoInfo.title,
			videoId: videoInfo.videoId
		});
	} catch (error) {
		console.error('Error fetching video details:', error);
		res.status(500).send("Failed to get video info");
	}
}
	