const { spawn } = require('child_process');
const YouTubeUtils = require('../utils/youtubeUtils');

// Helpers for formatting
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const milliseconds = String(ms % 1000).padStart(3, "0");
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
}

/**
 * Convert seconds (float) to milliseconds (int).
 * @param {number} value
 * @returns {number}
 */
function toMs(value) {
  // Use floor to avoid rounding forward in time
  return Math.floor(value * 1000);
}

function toSRT(transcript) {
  return transcript
    .map((entry, index) => {
      const start = formatTime(toMs(entry.start));

      // Clamp end to the earlier of (next start) or (start + duration)
      const nextStart = transcript[index + 1]?.start;
      const rawEnd = entry.start + entry.duration;
      const endSec = nextStart ? Math.min(nextStart, rawEnd) : rawEnd;

      const end = formatTime(toMs(endSec));

      return `${index + 1}\n${start} --> ${end}\n${entry.text}\n`;
    })
    .join("\n");
}

function toTXT(transcript) {
  return transcript.map((entry) => entry.text).join(" ");
}

// /**
//  * Convert seconds (float) to milliseconds (int).
//  * @param {number} value
//  * @returns {number}
//  */
// function toMs(value) {
//   return Math.round(value * 1000);
// }
class TranscriptService {
  /**
   * Fetch transcript entries for a YouTube video URL or ID.
   * @param {string} urlOrId YouTube watch URL or video ID
   * @param {object} opts { lang?: string }
   * @returns {Promise<Array<{ text: string; offset: number; duration: number }>>}
   */
  static async fetchTranscript(url, format = "txt") {
    const videoId = YouTubeUtils.parseVideoId(url);
    if (!videoId || videoId.length !== 11) {
      const error = new Error("Invalid YouTube URL or video ID");
      error.statusCode = 400;
      throw error;
    }

    return new Promise((resolve, reject) => {
      const py = spawn("python3", ["src/scripts/getVideoTranscription.py", videoId]);

      let dataBuffer = "";
      let errorBuffer = "";

      py.stdout.on("data", (data) => {
        dataBuffer += data.toString();
      });

      py.stderr.on("data", (data) => {
        errorBuffer += data.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          return reject(new Error(errorBuffer || "Unknown error"));
        }
        try {
          const transcriptionSnippets = JSON.parse(dataBuffer);
          const formattedTranscription = TranscriptService.format(transcriptionSnippets, format);
          resolve(formattedTranscription);
        } catch (err) {
          reject(new Error("Failed to parse transcript"));
        }
      });
    });
  }


  /**
   * Generate formatted transcript content.
   * @param {Array} transcript normalized transcript array
   * @param {"srt"|"txt"} format output format
   */
  static format(transcript, format) {
    if (format === "srt") return toSRT(transcript);
    return toTXT(transcript);
  }
}

module.exports = TranscriptService;
