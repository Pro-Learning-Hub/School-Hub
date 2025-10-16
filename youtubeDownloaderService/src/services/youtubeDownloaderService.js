const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const { PassThrough } = require("stream");
const { Readable } = require("stream");
const YouTubeUtils = require('../utils/youtubeUtils');


class YouTubeDownloadService {
  constructor() {
    this.downloadDir = process.env.DOWNLOAD_DIR || path.resolve(__dirname, "../../downloads");
    if (!fs.existsSync(this.downloadDir)) fs.mkdirSync(this.downloadDir);

    // Create subdirectories for different file types
    this.audioDir = path.join(this.downloadDir, "audio");
    this.videoDir = path.join(this.downloadDir, "video");
    
    if (!fs.existsSync(this.audioDir)) fs.mkdirSync(this.audioDir, { recursive: true });
    if (!fs.existsSync(this.videoDir)) fs.mkdirSync(this.videoDir, { recursive: true });

    this.cookiesPath = path.resolve(__dirname, "../../cookies.txt");

    this.inProgress = {}; // { videoId_type: { pass, waiting[] } }
    this.maxConcurrentDownloads = process.env.MAX_CONCURRENT_DOWNLOADS || 3;
    this.currentDownloads = 0;
    this.globalQueue = [];
  }

  processNextInQueue() {
    if (this.globalQueue.length > 0 && this.currentDownloads < this.maxConcurrentDownloads) {
      const nextRequest = this.globalQueue.shift();
      this.handleDownload(nextRequest.url, nextRequest.type, nextRequest.req, nextRequest.res, false);
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
    return YouTubeUtils.fetchVideoTitle(videoId);
  }

  getYTArgs(type, url, filePath, isRetry = false) {
    if (type === "mp3") {
      if (isRetry) {
        return [
          '-4',
          url,
          
          "-f", "18",
          "--extract-audio",
          "--audio-format", "mp3",
          "--no-playlist",
          "--output", filePath,

          "--cookies", this.cookiesPath
        ];
      } else {
        return [
          '-4',
          url,
          "-f", "bestaudio",
          // "--extract-audio",
          // "--audio-format", "mp3",
          "--no-playlist",
          "--output", filePath,

          "--cookies", this.cookiesPath
        ];
      }
    }

    return [
      "-f", "best[height<=720]/18",
      "--no-playlist",
      "--output", "-",
      url,
      // "--cookies", this.cookiesPath
    ];
  }

  getCachedFilePath(videoId, type) {
    // Use appropriate subdirectory based on file type
    if (type === "mp3") {
      return path.join(this.audioDir, `${videoId}.${type}`);
    } else {
      return path.join(this.videoDir, `${videoId}.${type}`);
    }
  }

  async handleDownload(url, type, req, res, isRetry = false) {
    try {
      const downloadContext = await this.prepareDownloadContext(url, type, res, isRetry);
      
      if (await this.handleExistingDownload(downloadContext, res, isRetry)) return;
      if (await this.handleCachedFile(downloadContext, res, isRetry)) return;
      if (await this.handleRateLimiting(downloadContext, req, res, isRetry)) return;

      await this.executeDownload(downloadContext, req, res, isRetry);
    } catch (err) {
      console.error("Download error:", err);
      res.status(500).send("Download failed");
    }
  }

  async prepareDownloadContext(url, type, res, isRetry) {
    const videoId = YouTubeUtils.parseVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const key = this.getDownloadKey(videoId, type);
    const filePath = this.getCachedFilePath(videoId, type);
    const tmpPath = filePath + '.tmp';

    const videoTitle = await this.fetchVideoTitle(videoId);
    console.log("Video Title:", videoTitle);
    this.setResponseHeaders(res, type, videoTitle || videoId);

    return {
      videoId,
      key,
      filePath,
      tmpPath,
      videoTitle,
      url,
      type
    };
  }

  async handleExistingDownload(downloadContext, res, isRetry) {
    const { key } = downloadContext;
    
    if (this.inProgress[key] && !isRetry) {
      this.inProgress[key].waiting.push(res);
      return true;
    }
    return false;
  }

  async handleCachedFile(downloadContext, res, isRetry) {
    const { filePath } = downloadContext;
    
    if (fs.existsSync(filePath) && !isRetry) {
      fs.createReadStream(filePath).pipe(res);
      return true;
    }
    return false;
  }

  async handleRateLimiting(downloadContext, req, res, isRetry) {
    if (this.currentDownloads >= this.maxConcurrentDownloads && !isRetry) {
      this.globalQueue.push({ 
        req, 
        res, 
        url: downloadContext.url, 
        type: downloadContext.type 
      });
      return true;
    }
    return false;
  }

  async executeDownload(downloadContext, req, res, isRetry) {
    const { key, type } = downloadContext;
    
    if (!isRetry) this.currentDownloads++;
    const pass = this.setupDownloadStream(downloadContext, res, isRetry);
    
    if (type === 'mp3') {
      await this.handleMp3Download(downloadContext, pass, req, res, isRetry);
    } else {
      await this.handleMp4Download(downloadContext, pass, req, res);
    }
  }

  setupDownloadStream(downloadContext, res, isRetry) {
    const { key } = downloadContext;
    
    if (!isRetry) {
      const pass = new PassThrough();
      this.inProgress[key] = { pass, waiting: [] };
      pass.pipe(res);
      return pass;
    } else {
      return this.inProgress[key].pass;
    }
  }

  async handleMp3Download(downloadContext, pass, req, res, isRetry) {
    const { url, filePath, key, type, videoId, videoTitle } = downloadContext;
    console.log(type)
    const yt = execFile('yt-dlp', this.getYTArgs(type, url, filePath, isRetry));
    
    yt.stderr.on("data", (data) => 
      console.error(`yt-dlp ${isRetry ? '(retry)' : ''} error: ${data}`)
    );
    yt.stdout.on('data', (data) => 
      console.log(`yt-dlp ${isRetry ? '(retry)' : ''} output: ${data}`)
    );
    
    yt.on('close', (code) => {
      console.log(`yt-dlp exit code: ${code}`);
      this.handleMp3DownloadComplete(code, downloadContext, pass, req, res, isRetry);
    });

    this.setupRequestAbortHandler(req, null, pass, downloadContext);
  }

  handleMp3DownloadComplete(code, downloadContext, pass, req, res, isRetry) {
    const { filePath, key, type, videoId, videoTitle, url } = downloadContext;
    
    if (code === 0) {
      fs.createReadStream(filePath).pipe(pass);
      this.handleDownloadComplete(key, type, videoId, true, filePath, videoTitle);
    } else if (code !== 0 && !isRetry) {
      console.log("First attempt failed, retrying with fallback arguments...");
      this.handleDownload(url, type, req, res, true);
    } else {
      res.status(500).json("Download failed");
      pass.destroy();
      this.handleDownloadComplete(key, type, videoId, false, filePath, videoTitle);
    }
  }

  async handleMp4Download(downloadContext, pass, req, res) {
    const { url, tmpPath, key, type, videoId, videoTitle, filePath } = downloadContext;
  
    const streamUrl = await this.getMp4StreamUrl(url);
    console.log("[yt-dlp] Stream URL:", streamUrl);
  
    // Detect HLS manifest (.m3u8)
    if (streamUrl.includes(".m3u8")) {
    console.log("Detected HLS manifest. Streaming segments...");
    await this.streamHlsManifest(streamUrl, pass, tmpPath);
    this.handleDownloadComplete(key, type, videoId, true, filePath, videoTitle);
    return;
    }
  
    // Otherwise: normal direct MP4 stream
    const response = await fetch(streamUrl);
    if (!response.ok) throw new Error("Failed to fetch stream");
  
    const nodeStream = Readable.fromWeb(response.body);
    const fileStream = fs.createWriteStream(tmpPath);
  
    nodeStream.pipe(pass);
    nodeStream.pipe(fileStream);
  
    fileStream.on("finish", () => {
    this.handleDownloadComplete(key, type, videoId, true, filePath, videoTitle);
    });
  
    this.setupRequestAbortHandler(req, nodeStream, pass, downloadContext, fileStream);
  }
  
  setupRequestAbortHandler(req, streamSource, pass, downloadContext, fileStream = null) {
    const { key, type, videoId, filePath, videoTitle } = downloadContext;
    
    req.on("aborted", () => {
      console.log('Request aborted');
      streamSource?.unpipe(pass);
      if (!this.inProgress[key]?.waiting.length) {
        streamSource?.unpipe(fileStream);
        streamSource?.destroy();
        pass.destroy();
        this.handleDownloadComplete(key, type, videoId, false, filePath, videoTitle);
      }
    });
  }

  handleDownloadComplete(key, type, videoId, success, filePath, videoTitle) {
    if (type !== 'mp3') {
      const tmpPath = filePath + ".tmp";
      if (success && fs.existsSync(tmpPath)) {
        fs.renameSync(tmpPath, filePath);
      } else if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
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

  async getMp4StreamUrl(videoUrl) {
    return new Promise((resolve, reject) => {
      execFile("yt-dlp", [
        videoUrl,
        "-f", "best[height<=720]/18",
        "--get-url",
        "--no-playlist",
        "--cookies", this.cookiesPath
      ], { encoding: "utf8" }, (error, stdout) => {
        if (error) {
          return reject(error);
        }

        const url = stdout.trim().split("\n")[0];
        if (!url) {
          return reject(new Error("No stream URL found"));
        }

        resolve(url);
      });
    });
  }

  async streamHlsManifest(manifestUrl, pass, tmpPath) {
    const manifestRes = await fetch(manifestUrl);
    if (!manifestRes.ok) throw new Error("Failed to fetch HLS manifest");

    const manifestText = await manifestRes.text();
    const segments = this.parseSimpleM3U8(manifestText, manifestUrl);

    if (!segments || segments.length === 0) {
      throw new Error("No segments found in HLS manifest");
    }

    const fileStream = fs.createWriteStream(tmpPath);
    console.log(`[HLS] Streaming ${segments.length} segments from manifest...`);

    for (const segUrl of segments) {
      try {
        const segRes = await fetch(segUrl);
        if (!segRes.ok) {
          console.warn(`[HLS] Failed to fetch segment: ${segUrl}`);
          continue;
        }

        // Stream each segment to both response and file
        await new Promise((resolve, reject) => {
          const segStream = Readable.fromWeb(segRes.body);
          segStream.on("error", reject);
          segStream.on("end", resolve);
          segStream.pipe(pass, { end: false });
          segStream.pipe(fileStream, { end: false });
        });
      } catch (err) {
        console.error(`[HLS] Segment error: ${err.message}`);
      }
    }

    // End both streams after all segments
    pass.end();
    fileStream.end();
    console.log("[HLS] Completed streaming all segments");
  }

  /**
   * Minimal M3U8 parser: extracts all segment URLs.
   */
  parseSimpleM3U8(manifestText, baseUrl) {
    const lines = manifestText.split("\n");
    const segments = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      // Convert relative URIs to absolute
      try {
        const fullUrl = new URL(trimmed, baseUrl).href;
        segments.push(fullUrl);
      } catch {
        console.warn(`[HLS] Invalid segment URI: ${trimmed}`);
      }
    }

    return segments;
  }

}

module.exports = YouTubeDownloadService;
