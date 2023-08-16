// background.js

console.log("background.js is running again!");

// chrome.runtime.onMessage.addListener(
//     async function(request, sender, sendResponse) {
//         console.log(
//         sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//         if (request.greeting === "hello")
//             sendResponse({
//                 farewell: "goodbye",
//             });
//     }
// );

const fetchData = async () => {
        const { sessionToken } = await chrome.storage.session.get("sessionToken");
        const { sessionId } = await chrome.storage.session.get("sessionId");
        const { userId } = await chrome.storage.session.get("userId");
        const { keyWrappingKey } = await chrome.storage.session.get("keyWrappingKey");
        const { keyWrappingKeyPublic } = await chrome.storage.session.get("keyWrappingKeyPublic");                

        return {
            sessionToken: sessionToken,
            userId: userId,
            sessionId: sessionId,
            keyWrappingKey: keyWrappingKey,
            keyWrappingKeyPublic: keyWrappingKeyPublic
        }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(
        sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        if (request.greeting === "hello"){
            fetchData().then(data => {
                sendResponse({
                    farewell: "goodbye",
                    ...data
                });
            })
        }
        return true;
    }
);

// let setExpoTimeout = function (
// 	callback,
// 	initialDelay,
// 	maxDelay,
// 	maxRetries = Infinity,
// 	runIndefinitely = false
// ) {
// 	let retries = 0;

// 	function execute() {
// 		if (retries >= maxRetries) {
// 			return; // Exit if max retries reached
// 		}

// 		callback();
// 		retries++;
// 		let nextDelay = Math.min(initialDelay * 2 ** retries, maxDelay);
// 		if (runIndefinitely || nextDelay !== maxDelay) {
// 			setTimeout(execute, nextDelay);
// 		}
// 	}

// 	setTimeout(execute, initialDelay);
// };

// const sendMessage = async (message, callback) => {
//     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//     const response  = await chrome.tabs.sendMessage(tab.id, message, callback);
// 	console.log("Message sent sendMessage", message);
// };

// const processMessageBatch = () => {
// 	chrome.storage.session.get("sesssionToken", (token) => {
// 		console.log("getSessionToken", token);
// 		sendMessage({
// 			type: "getSessionToken",
// 			token: token,
// 		});
// 	});

	// chrome.storage.session.get("sesssionId", (sessionId) => {
	//     sendMessage({
	//         type: "getSessionId",
	//         sessionId: sessionId,
	//     });
	// });

	// chrome.storage.session.get("userId", (userId) => {
	//     sendMessage({
	//         type: "getUserId",
	//         userId: userId,
	//     });
	// });
// };

// // Usage example:
// setExpoTimeout(
// 	() => {
// 		processMessageBatch();
// 		console.log("Sent a new batch of meta info.");
// 	},
// 	3000,
// 	320000,
// 	Infinity,
// 	true
// );
