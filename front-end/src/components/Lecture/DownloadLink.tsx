import React, { useEffect, useRef, useState } from 'react';
import { DOMAIN } from '../../utils/constants';
import { toast } from 'react-hot-toast';


interface DownloadLinkProps {
  videoUrl: string;
  mediaType: 'video' | 'audio';
  children?: React.ReactNode;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({ videoUrl, mediaType, children }) => {

	const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		
		toast.loading(`Preparing ${mediaType}... Download should start soon.`, {
			duration: 5_000,
		})
		
		const downloadUrl = `${DOMAIN}/lectures/media?type=${mediaType}&url=${encodeURIComponent(videoUrl)}`;

		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.src = downloadUrl;
		document.body.appendChild(iframe);

		// remove iframe after some time
		// don't clean up on unmount so download continues after navigating away
		setTimeout(() => iframe.remove(), 600_000);
	}

	return (
		<>
			<a href="#" onClick={onClickHandler}>
				{children ? children : (mediaType === 'video' ? 'Video' : 'Audio')}
			</a>
		</>
	)

};

export default DownloadLink;
