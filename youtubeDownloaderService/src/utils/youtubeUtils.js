/**
 * YouTube utilities for extracting video information
 */

class YouTubeUtils {
  /**
   * Extract YouTube video ID from URL or return ID if already provided
   * @param {string} url YouTube URL
   * @returns {string|null} Video ID or null if invalid
   */
  static parseVideoId(url) {
    // Extract from various YouTube URL formats
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  }

  /**
   * Fetch video title using YouTube Data API
   * @param {string} videoId YouTube video ID
   * @returns {Promise<string|null>} Video title or null if not found/error
   */
  static async fetchVideoTitle(videoId) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YOUTUBE_API_KEY not found in environment variables");
      return null;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
      );
      
      if (!response.ok) {
        console.error(`YouTube API error: ${response.status} ${response.statusText}`);
        return null;
      }

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

  /**
   * Get both video ID and title in parallel
   * @param {string} url YouTube URL
   * @returns {Promise<{videoId: string|null, title: string|null}>}
   */
  static async getVideoInfo(url) {
    const videoId = YouTubeUtils.parseVideoId(url);
    
    if (!videoId) {
      return { videoId: null, title: null };
    }

    // Fetch title and return both
    const title = await YouTubeUtils.fetchVideoTitle(videoId);
    
    return { videoId, title };
  }
}

module.exports = YouTubeUtils;
