import React, { useEffect, useRef, useState } from 'react';
import { DOMAIN } from '../../utils/constants';
import { toast } from 'react-hot-toast';
import useDownload from '../../hooks/useYTDownload';
import './LectureDownload.css';

export type lectureDownloadFormat = "video" | "audio" | "transcript" | "subtitles";

interface DownloadLinkProps {
  videoUrl: string;
  type: lectureDownloadFormat;
  children?: React.ReactNode;
  className?: string;
}

const DownloadLectureLink: React.FC<DownloadLinkProps> = ({ videoUrl, type, children, className = '' }) => {
  const {downloadMedia, downloadTranscript, isTranscriptLoading} = useDownload();

  const isDownloading = ["transcript", "subtitles"].includes(type) && isTranscriptLoading;
  const displayText = type.charAt(0).toUpperCase() + type.slice(1);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (type === 'video' || type === 'audio') {
      downloadMedia(videoUrl, type);
    } else if (type === 'transcript' || type === 'subtitles') {
      downloadTranscript(videoUrl, type);
    }
  }

	return (
		<>
			<a
        href="#"
        onClick={handleDownload}
        className={`${className} ${isDownloading ? 'downloading' : ''}`.trim()}
        aria-disabled={isDownloading}
        >
				{children ? children : displayText}
			</a>
		</>
	)

};

export default DownloadLectureLink;
