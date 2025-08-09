const YouTubeDownloadService = require("../services/youtubeDownloaderService");


require("dotenv").config();
const apiKey = process.env.YOUTUBE_API_KEY;

module.exports =  function videoInfoHandler(req, res) {
		const url = req.query.url;
		if (!url) return res.status(400).send("Missing ?url=");
		const videoId = YouTubeDownloadService.parseVideoId(url);
		console.log(url, videoId);
		
		fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
		.then(response => response.json())
		.then(data => res.json({
			title: data.items[0].snippet.title,
		}))
		.catch(error => {
			console.error('Error fetching video details:', error);
			res.status(500).send("Failed to get video info");
		});
}
	