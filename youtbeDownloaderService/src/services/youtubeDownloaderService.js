const { spawn, execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { PassThrough } = require("stream");
const { Readable } = require("stream");

// const fetch = require("node-fetch");


class YouTubeDownloadService {
  constructor() {
    this.downloadDir = process.env.DOWNLOAD_DIR || path.resolve(__dirname, "../../xdownloads");
    if (!fs.existsSync(this.downloadDir)) fs.mkdirSync(this.downloadDir);

    this.cookiesPath = path.resolve(__dirname, "../../cookies.txt");

    if (!fs.existsSync(this.downloadDir)) fs.mkdirSync(this.downloadDir);

    this.inProgress = {}; // { videoId_type: { pass, waiting[] } }
    this.maxConcurrentDownloads = process.env.MAX_CONCURRENT_DOWNLOADS || 3;
    this.currentDownloads = 0;
    this.globalQueue = [];
  }

  processNextInQueue() {
    if (this.globalQueue.length > 0 && this.currentDownloads < this.maxConcurrentDownloads) {
      const nextRequest = this.globalQueue.shift();
      this.handleDownload(nextRequest.url, nextRequest.type, nextRequest.req, nextRequest.res);
    }
  }

  getDownloadKey(videoId, type) {
    return `${videoId}_${type}`;
  }

  setResponseHeaders(res, type, title) {
    const encodedTitle = encodeURIComponent(title);

    if (type === "mp3") {
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedTitle}.mp3`);
      res.setHeader("Content-Type", "audio/mpeg");
    } else {
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedTitle}.mp4`);
      res.setHeader("Content-Type", "video/mp4");
    }
  }

  async fetchVideoTitle(videoId) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return null;
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
      const data = await response.json();
      if (data.items && data.items[0] && data.items[0].snippet && data.items[0].snippet.title) {
        return data.items[0].snippet.title;
      }
      return null;
    } catch (err) {
      console.error("Error fetching video title:", err);
      return null;
    }
  }

  getYTArgs(type, url) {
    if (type === "mp3") {
      return [
        url,
        "-f", "bestaudio",
        "--extract-audio",
        "--audio-format", "mp3",
        "--no-playlist",
        "--output", "-",
        "--cookies", this.cookiesPath
      ];
    }

    return [
      url,
      "-f", "best[ext=mp4]",
      "--no-playlist",
      "--output", "-",
      "--cookies", this.cookiesPath
    ];
  }

  getCachedFilePath(videoId, type) {
    // Always use videoId for caching and internal file naming
    return path.join(this.downloadDir, `${videoId}.${type}`);
  }

  async handleDownload(url, type, req, res) {
    const videoId = YouTubeDownloadService.parseVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const key = this.getDownloadKey(videoId, type);
    const filePath = this.getCachedFilePath(videoId, type);
    const tmpPath = filePath + '.tmp';

    // Fetch video title for headers (only for download filename)
    let videoTitle = await this.fetchVideoTitle(videoId);
    console.log("Video Title:", videoTitle);
    this.setResponseHeaders(res, type, videoTitle || videoId);

    if (this.inProgress[key]) {
      this.inProgress[key].waiting.push(res);
      return;
    }

    if (fs.existsSync(filePath)) {
      return fs.createReadStream(filePath).pipe(res);
    }

    // Rate limiting check
    if (this.currentDownloads >= this.maxConcurrentDownloads) {
      this.globalQueue.push({ req, res, url, type });
      return;
    }

    this.currentDownloads++;

    const pass = new PassThrough();
    this.inProgress[key] = { pass, waiting: [] };
    pass.pipe(res);

    let streamSource;
    try {
      if (type === 'mp3') {
        const yt = spawn("yt-dlp", this.getYTArgs(type, url));
        streamSource = yt.stdout;

        yt.stderr.on("data", (data) => console.error(`yt-dlp error: ${data}`));
      } else {
        const streamUrl = this.getMp4StreamUrl(url);
        const response = await fetch(streamUrl);
        if (!response.ok) throw new Error("Failed to fetch stream");

        const nodeStream = Readable.fromWeb(response.body);
        streamSource = nodeStream;
      }

      const fileStream = fs.createWriteStream(tmpPath);
      streamSource.pipe(fileStream);
      streamSource.pipe(pass);

      fileStream.on("finish", () => {
        this.handleDownloadComplete(key, type, videoId, true, filePath, videoTitle);
      });

      req.on("aborted", () => {
        streamSource.unpipe(pass);
        if (!this.inProgress[key]?.waiting.length) {
          streamSource.unpipe(fileStream);
          streamSource.destroy();
          pass.destroy();
          this.handleDownloadComplete(key, type, videoId, false, filePath, videoTitle);
        }
      });
    } catch (err) {
      console.error("Download error:", err);
      this.handleDownloadComplete(key, type, videoId, false, filePath, videoTitle);
      res.status(500).send("Download failed");
    }
  }

  handleDownloadComplete(key, type, videoId, success, filePath, videoTitle) {
    const tmpPath = filePath + ".tmp";
    if (success && fs.existsSync(tmpPath)) {
      fs.renameSync(tmpPath, filePath);
    } else if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }

    const waitingClients = this.inProgress[key]?.waiting || [];
    for (const client of waitingClients) {
      if (!success) {
        client.status(500).send("Download failed");
        continue;
      }

      this.setResponseHeaders(client, type, videoTitle || videoId);
      fs.createReadStream(filePath).pipe(client);
    }
    delete this.inProgress[key];
    
    this.currentDownloads--;      
    this.processNextInQueue();
  }

  getMp4StreamUrl(videoUrl) {
    const stdout = execFileSync("yt-dlp", [
      videoUrl,
      "-f", "best[ext=mp4]",
      "--get-url",
      "--no-playlist",
      "--cookies", this.cookiesPath
    ], { encoding: "utf8" });

    const url = stdout.trim().split("\n")[0];
    if (!url) throw new Error("No stream URL found");

    return url;
  }

  static parseVideoId(url) {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  } 

}

module.exports = YouTubeDownloadService;
