import React, { useEffect, useRef, useState } from 'react';
import { DOMAIN } from '../../utils/constants';

interface DownloadLinkProps {
  videoUrl: string;
  mediaType: 'video' | 'audio';
  children?: React.ReactNode;
}

const DownloadLink: React.FC<DownloadLinkProps> = ({ videoUrl, mediaType, children }) => {
	const [showMessage, setShowMessage] = useState<boolean>(false);

	const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		setShowMessage(true);
		const downloadUrl = `${DOMAIN}/lectures/media?type=${mediaType}&url=${encodeURIComponent(videoUrl)}`;

		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.src = downloadUrl;
		document.body.appendChild(iframe);

		// remove iframe after some time
		// don't clean up on unmount so download continues after navigating away
		setTimeout(() => iframe.remove(), 600_000);
	}

	// remove the message after 5 seconsds
	useEffect(() => {
		if (showMessage) {
			const timer = setTimeout(() => {
				setShowMessage(false);
			}, 60_000);
			return () => clearTimeout(timer);
		}
	}, [showMessage]);
	
	return (
		<>
			<a href="#" onClick={onClickHandler}>
				{children ? children : (mediaType === 'video' ? 'Video' : 'Audio')}
			</a>
			{showMessage && <p>Download Request's been queued, Download should start soon...</p>}
		</>
	)

};

export default DownloadLink;
