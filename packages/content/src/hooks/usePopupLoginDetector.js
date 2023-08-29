import { useEffect } from "react";

const usePopupLoginDetector = ({ callback }) => {
	useEffect(() => {
		function handleMessage(message, sender, sendResponse) {
			console.warn("Received message from popup action: ", message);
			if (message["message"] === "popup_script_login_trigger") {
				chrome.runtime.sendMessage(
					{ greeting: "hello" },
					(response) => {
						callback(response);
					}
				);
			}
		}
		// In the content script:
		if (chrome?.runtime?.onMessage?.addListener) {
			chrome.runtime.onMessage.addListener(handleMessage);
			return () => {
				chrome.runtime.onMessage.removeListener(handleMessage);
			};
		}
	}, [callback]);
};

export default usePopupLoginDetector;
