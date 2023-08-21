/* eslint-disable */
// background.js
import axios from "axios";
// import httpAdapter from 'axios/lib/adapters/http';

// axios.defaults.adapter = httpAdapter;

import CryptoJS from "crypto-js";
import forge from "node-forge";

console.log("background.js is running again!");

export const BASE_URL = "http://localhost:8000/api/v1";
export const CLIENT_ID = "b980b13c-4db8-4e8a-859c-4544fd70825f";

// const clientId = 'b980b13c-4db8-4e8a-859c-4544fd70825f';
// const BASE_URL = 'https://keylance-backend-svc-dev.up.railway.app/api/v1'

// export async function getVaults({sessionId, userId, sessionToken}) {
// 	const cookies = `sessionId=${sessionId}; userId=${userId}; sessionToken=${sessionToken}`;
//     const requestUrl = `${BASE_URL}/users/me/vaults`;
//     const config = {
//         withCredentials: true,
//         method: 'get',
//         url: requestUrl,
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             'client-id': CLIENT_ID,
// 			Cookie: cookies
//         },
//     };

//     try {
//         const response = await axios(config);
//         return response?.data || {};
//     } catch (error) {
//         const errorMessage =
//             error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
//         throw Error(errorMessage);
//     }
// }

// export async function getVaultItems(vaultId) {
//     const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items`;
//     const config = {
//         withCredentials: true,
//         method: 'get',
//         url: requestUrl,
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             'client-id': CLIENT_ID,
//         },
//     };

//     try {
//         const response = await axios(config);
//         return response?.data || {};
//     } catch (error) {
//         const errorMessage =
//             error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
//         throw Error(errorMessage);
//     }
// }

export async function getVaults({ sessionId, userId, sessionToken }) {
	const cookies = `sessionId=${sessionId}; userId=${userId}; sessionToken=${sessionToken}`;
	const requestUrl = `${BASE_URL}/users/me/vaults`;

	try {
		const response = await fetch(requestUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"client-id": CLIENT_ID,
				Cookie: cookies,
			},
			credentials: "include",
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(
				data?.detail?.info ||
					`Something went wrong: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function getVaultItems(vaultId) {
	const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items`;

	try {
		const response = await fetch(requestUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"client-id": CLIENT_ID,
			},
			credentials: "include",
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(
				data?.detail?.info ||
					`Something went wrong: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		throw error;
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
	const ciphertext = CryptoJS.lib.WordArray.create(
		concatenated.words.slice(4)
	);
	const cipherParams = CryptoJS.lib.CipherParams.create({
		ciphertext: ciphertext,
	});

	// Decrypt the data
	const decrypted = CryptoJS.AES.decrypt(
		cipherParams,
		CryptoJS.enc.Utf8.parse(key),
		{
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
			iv: iv,
		}
	);

	return decrypted.toString(CryptoJS.enc.Utf8);
}

const fetchDataUrl = async (iconUrl) => {
	const response = await fetch(
		`http://localhost:8000/api/v1/fetch-image/?url=${encodeURIComponent(
			iconUrl
		)}`
	);
	const data = await response.json();
	return data.data_url;
};

const decryptedItemData = async (itemData, keyWrappingKeyPair) => {
	const iek = keyWrappingKeyPair.private.decrypt(
		itemData.encryptedEncryptionKey
	);

	const iconUrl = `https://cool-rose-moth.faviconkit.com/${decryptData(
		itemData.website,
		iek
	)}/64`;

	const iconDataUrl = await fetchDataUrl(iconUrl);

	return {
		id: itemData.id,
		title: decryptData(itemData.title, iek),
		website: decryptData(itemData.website, iek),
		username: decryptData(itemData.username, iek),
		password: decryptData(itemData.password, iek),
		iek: iek,
		icon: iconUrl,
		iconDataUrl: iconDataUrl,
	};
};

const fetchData = async () => {
	const { sessionToken } = await chrome.storage.session.get("sessionToken");
	const { sessionId } = await chrome.storage.session.get("sessionId");
	const { userId } = await chrome.storage.session.get("userId");
	const { keyWrappingKey } = await chrome.storage.session.get(
		"keyWrappingKey"
	);
	const { keyWrappingKeyPublic } = await chrome.storage.session.get(
		"keyWrappingKeyPublic"
	);

	return {
		sessionToken: sessionToken,
		userId: userId,
		sessionId: sessionId,
		keyWrappingKey: keyWrappingKey,
		keyWrappingKeyPublic: keyWrappingKeyPublic,
	};
};

const getFullItemList = async () => {
	const sensitiveData = await fetchData();
	const {
		sessionId,
		userId,
		sessionToken,
		keyWrappingKey,
		keyWrappingKeyPublic,
	} = sensitiveData;

	Object.entries(sensitiveData).forEach(([key, val]) => {
		if (!val) {
			throw Error(`${key} is not available in chrome session storage.`);
		}
	});

	const vaults = await getVaults({
		sessionId: sessionId,
		userId: userId,
		sessionToken: sessionToken,
	});

	const itemList = [];
	for (let idx = 0; idx < vaults.length; idx += 1) {
		const data = await getVaultItems(vaults[idx].id);
		console.log(vaults[idx].id, vaults[idx].name, data);
		for (let jdx = 0; jdx < data.length; jdx += 1) {
			const vaultItem = data[jdx];
			const keyWrappingKeyPair = getKeyWrappingKeyPair(
				keyWrappingKey,
				keyWrappingKeyPublic
			);
			itemList.push(
				await decryptedItemData(vaultItem, keyWrappingKeyPair)
			);
		}
	}

	return itemList;
};

const getLoginStatus = async () => {
	try {
		const response = await fetch(`${BASE_URL}/auth/status`, {
			method: "GET",
			credentials: "include", // Equivalent to withCredentials: true in axios
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		// Check if the request was successful
		if (!response.ok) {
			const errorData = await response.json();
			return (
				errorData?.detail?.info || `HTTP Error: ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		return {
			error: error.message || `Something went wrong: ${error}.`,
		};
	}
};

const setActionIcon = (locked = false) => {
	if (chrome?.action?.setIcon) {
		if (locked) {
			console.log("Setting the badged icon 🔒 from service worker");
			chrome.action.setIcon({
				path: {
					// 16: "Padlock6.png",
					// 48: "Padlock6.png",
					128: "Padlock6.png",
				},
			});
			console.log("Badged Icon was set!");
		} else {
			console.log("Setting the simple icon ✅ from service worker");
			chrome.action.setIcon({
				path: {
					// 16: "Logo-mini-derived-128.png",
					// 48: "Logo-mini-derived-128.png",
					128: "Logo-mini-derived-128.png",
				},
			});
			console.log("Simple Icon was set!");
		}
	} else {
		console.log("Logged In! Chrome api not available on service worker!");
	}
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(
		sender.tab
			? "from a content script:" + sender.tab.url
			: "from the extension"
	);
	if (request.greeting === "hello") {
		getLoginStatus()
			.then((data) => {
				const { loggedIn, error } = data;
				if (loggedIn) {
					getFullItemList()
						.then((data) => {
							console.log("data", data);
							sendResponse({
								farewell: "goodbye",
								itemList: data,
								meta: {
									loggedIn: true,
								},
							});
							setActionIcon(false);
						})
						.catch((error) => {
							console.error(error);
							sendResponse({
								meta: {
									loggedIn: false,
									error:
										error.message ||
										`Something went wrong: ${error}.`,
								},
							});
							setActionIcon(true);
						});
				} else {
					console.error(error);
					sendResponse({
						meta: {
							loggedIn: false,
							error: error,
						},
					});
					setActionIcon(true);
				}
			})
			.catch((error) => {
				console.error(error);
				sendResponse({
					meta: {
						loggedIn: false,
						error:
							error.message || `Something went wrong: ${error}.`,
					},
				});
				setActionIcon(true);
			});
	}
	return true;
});
