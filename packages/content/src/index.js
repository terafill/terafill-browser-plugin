import React from "react";
import ReactDOM from "react-dom";

import axios from 'axios';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';


import HeadlessApp from "./App";
import { createButton, createPopup } from "./components";
import {
	positionButton,
	positionPopup,
	identifyFieldType,
	hasLoginForm,
} from "./utils";

let fieldTypeMap = {};

// Iteratively Identify type of input fields present on the html page.
const inputFields = document.querySelectorAll("input");
inputFields.forEach((input) => {
	const fieldsType = identifyFieldType(input);
	fieldTypeMap[input.id] = fieldsType;
	console.log("identifyFieldType", fieldsType);
});

let setExpoTimeout = function (
	callback,
	initialDelay,
	maxDelay,
	maxRetries = Infinity,
	runIndefinitely = false
) {
	let retries = 0;

	function execute() {
		if (retries >= maxRetries) {
			return; // Exit if max retries reached
		}

		callback();
		retries++;
		let nextDelay = Math.min(initialDelay * 2 ** retries, maxDelay);
		if (runIndefinitely || nextDelay !== maxDelay) {
			setTimeout(execute, nextDelay);
		}
	}

	setTimeout(execute, initialDelay);
};


export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api/v1';
export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || 'b980b13c-4db8-4e8a-859c-4544fd70825f';

// const clientId = 'b980b13c-4db8-4e8a-859c-4544fd70825f';
// const BASE_URL = 'https://keylance-backend-svc-dev.up.railway.app/api/v1'


export async function getVaults({sessionId, userId, sessionToken}) {
	const cookies = `sessionId=${sessionId}; userId=${userId}; sessionToken=${sessionToken}`;
    const requestUrl = `${BASE_URL}/users/me/vaults`;
    const config = {
        withCredentials: true,
        method: 'get',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'client-id': CLIENT_ID,
			Cookie: cookies
        },
    };

    try {
        const response = await axios(config);
        return response?.data || {};
    } catch (error) {
        const errorMessage =
            error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
        throw Error(errorMessage);
    }
}

export async function getVaultItems(vaultId) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items`;
    const config = {
        withCredentials: true,
        method: 'get',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'client-id': CLIENT_ID,
        },
    };

    try {
        const response = await axios(config);
        return response?.data || {};
    } catch (error) {
        const errorMessage =
            error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
        throw Error(errorMessage);
    }
}

export const getKeyWrappingKeyPair = (keyWrappingKey, keyWrappingKeyPublic) => {
    return {
        public: forge.pki.publicKeyFromPem(keyWrappingKeyPublic),
        private: forge.pki.privateKeyFromPem(keyWrappingKey),
    };
};

export function decryptData(cipherTextWithIv, key) {
    // Convert the base64 string back to a WordArray
    const concatenated = CryptoJS.enc.Base64.parse(cipherTextWithIv);

    // Split the IV and ciphertext parts
    const iv = CryptoJS.lib.WordArray.create(concatenated.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(concatenated.words.slice(4));
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext });

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

const decryptedItemData = (itemData, keyWrappingKeyPair) => {
	const iek = keyWrappingKeyPair.private.decrypt(
		itemData.encryptedEncryptionKey
	);
	return {
		id: itemData.id,
		title: decryptData(itemData.title, iek),
		website: decryptData(itemData.website, iek),
		username: decryptData(itemData.username, iek),
		password: decryptData(itemData.password, iek),
		iek: iek,
		icon: `https://cool-rose-moth.faviconkit.com/${decryptData(
			itemData.website,
			iek
		)}/256`,
	};
};

const getFullItemList = async ({sessionId, userId, sessionToken, keyWrappingKey, keyWrappingKeyPublic}) => {
	const vaults = await getVaults({sessionId: sessionId, userId: userId, sessionToken: sessionToken});
	
	const itemList = [];
	for(let idx=0;idx<vaults.length;idx+=1){
		const data = await getVaultItems(vaults[idx].id);
		console.log(vaults[idx].id, vaults[idx].name, data);
		data.forEach((vaultItem)=>{
			const keyWrappingKeyPair = getKeyWrappingKeyPair(keyWrappingKey, keyWrappingKeyPublic);
			itemList.push(decryptedItemData(vaultItem, keyWrappingKeyPair));
		})
	}

	return itemList;
}

// Usage example:
setExpoTimeout(
	async () => {
		const response = await chrome.runtime.sendMessage({
			greeting: "hello",
		}, async (response) => {
			console.log("callback response", response);
			const itemList = await getFullItemList(response);
			console.log("vault data", itemList);
			setUpPopup(itemList);
		});
		// const response = await new Promise((resolve) => {
		// 	chrome.runtime.sendMessage({ greeting: "hello" }, resolve);
		// });
	
	
		// do something with response here, not outside the function
		console.log(response);
		console.log("Sent a new batch of meta info.");
	},
	1000,
	320000,
	Infinity,
	true
);

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     // Handle message
//     console.log("message from service worker! ", message);

//     // Optionally send a response
//     sendResponse({ data: "Message received" });
// });


function getDomain(url) {
    try {
        let parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (e) {
        console.error(`Invalid URL: ${url}`);
        return null;
    }
}

function haveSameDomain(url1, url2) {
    return getDomain(url1) === getDomain(url2);
}

function setUpPopup(itemList){
	// Show autofill suggestions if login form is present
	if (hasLoginForm()) {
		console.log("Login form found!");
		const inputFields = document.querySelectorAll(
			`input[type="password"], input[type="text"], input[type="email"]`
		);

		inputFields.forEach((inputField) => {
			// Setup button for input field
			const button = createButton();
			button.id = `button-${inputField.id}`;
			positionButton(button, inputField);
			document.body.appendChild(button);

			window.addEventListener("resize", () => {
				positionButton(button, inputField);
			});

			// Setup autofill suggestion popup
			let popup = createPopup(
				fieldTypeMap[inputField.id],
				inputField,
				fieldTypeMap,
				itemList
			);
			popup.id = `popup-${inputField.id}`;

			// Toggle autofill suggestion popup on button click
			button.addEventListener("click", () => {
				// chrome.storage.session.get("sesssionToken");
				// chrome.storage.session.get("sesssionId");
				// chrome.storage.session.get("userId");
				if (!document.getElementById(popup.id)) {
					document.body.appendChild(popup);
				} else {
					popup.remove();
				}
			});

			positionPopup(popup, inputField);

			inputField.addEventListener("focus", () => {
				document.body.appendChild(popup);
			});

			inputField.addEventListener("blur", (e) => {
				popup.remove();
			});

			window.addEventListener("resize", () => {
				positionPopup(popup, inputField);
			});

			window.addEventListener("mouseup", (e) => {
				if (
					e.target !== popup &&
					e.target.parentNode !== popup &&
					e.target !== inputField
				) {
					popup.remove();
				}
			});
		});
	} else {
		// todo - what happens if login form is not present
		console.log("No Login form found!");
	}
}

// const body = document.querySelector("body");
// // const app = document.createElement("div");
// // app.id = "root-myapp";

// if (body) {
// 	// ReactDOM.render(<HeadlessApp />, body);
// 	//     body.prepend(app);
// }

// document.body.addEventListener("click", function (event) {
//   if (event.target.tagName.toLowerCase() === "input") {
//     alert("Input clicked!");

//     const div = document.createElement("div");
//     document.body.appendChild(div);

//     const rect = event.target.getBoundingClientRect();
//     div.style.position = "absolute";
//     div.style.left = rect.left + window.scrollX + "px";
//     div.style.top = rect.bottom + window.scrollY + "px";
//     div.style.zIndex = 1000;

//     ReactDOM.render(<Tooltip />, div);
//   }
// });

// function Tooltip() {
//     return (
//         <div style={{ border: "1px solid black", padding: "5px" }}>
//             Your Tooltip Content
//         </div>
//     );
// }
