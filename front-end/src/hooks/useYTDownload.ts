import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { DOMAIN } from "../utils/constants";

/**
 * Types of downloadable media supported
 */
export type MediaType = "audio" | "video";

/**
 * Types of transcript downloads supported
 */
export type TranscriptType = "transcript" | "subtitles";

interface UseDownloadReturn {
  isTranscriptLoading: boolean;
  downloadMedia: (videoUrl: string, mediaType: MediaType) => Promise<void>;
  downloadTranscript: (videoUrl: string, type?: TranscriptType) => Promise<void>;
}

/**
 * Custom hook for handling media and transcript downloads.
 * Provides consistent loading states and error handling.
 */
export default function useDownload(): UseDownloadReturn {
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  const downloadMedia = useCallback(
    async (videoUrl: string, mediaType: MediaType): Promise<void> => {
      if (!videoUrl?.trim()) {
        toast.error(
          `Please provide a valid YouTube URL for ${mediaType} download.`
        );
        return;
      }

      try {
        toast.loading(`Preparing ${mediaType}... Download should start ${
          mediaType === "video"
          ? "soon"
          : "within 3 minutes"
        }.`, {
          duration: 5000,
        });

        const downloadUrl = `${DOMAIN}/lectures/media?type=${mediaType}&url=${encodeURIComponent(
          videoUrl
        )}`;

        // Create hidden iframe for download
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);

        // Clean up iframe after 10 minutes
        setTimeout(() => {
          iframe.remove();
        }, 600_000);
      } catch (error) {
        console.error("Media download error:", error);
        toast.error(`Failed to download ${mediaType}`);
      }
    },
    []
  );

  const downloadTranscript = useCallback(
    async (videoUrl: string, type: TranscriptType = "transcript"): Promise<void> => {
      if (!videoUrl?.trim()) {
        toast.error(`Please provide a valid YouTube URL for ${type} download.`);
        return;
      }

      setIsTranscriptLoading(true);

      const fetchTranscript = async (): Promise<void> => {
        const format = type === "subtitles" ? "srt" : "txt";

        try {
          const response = await fetch(
            `${DOMAIN}/lectures/transcript?url=${encodeURIComponent(
              videoUrl
            )}&format=${encodeURIComponent(format)}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch transcript");
          }

          const blob = await response.blob();
          const downloadUrl = URL.createObjectURL(blob);

          // Create download link and trigger download
          const link = document.createElement("a");
          link.href = downloadUrl;

          let fileName = decodeURIComponent(response.headers.get('X-File-Name') || "");
          if (!fileName)
            fileName = format === 'txt' ? 'transcript.txt' : 'subtitles.srt';
          link.download = fileName;

          document.body.appendChild(link);
          link.click();
          link.remove();

          // Clean up object URL
          URL.revokeObjectURL(downloadUrl);
        } finally {
          setIsTranscriptLoading(false);
        }
      };

      toast.promise(fetchTranscript(), {
        loading: `Fetching ${type}...`,
        success: "Download started!",
        error: `Error fetching ${type}.`,
      });
    },
    []
  );

  return {
    isTranscriptLoading,
    downloadMedia,
    downloadTranscript,
  };
}
