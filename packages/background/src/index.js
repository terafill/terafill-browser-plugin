/* eslint-disable */ 
// background.js
import axios from 'axios';
// import httpAdapter from 'axios/lib/adapters/http';

// axios.defaults.adapter = httpAdapter;


import CryptoJS from 'crypto-js';
import forge from 'node-forge';

console.log("background.js is running again!");

export const BASE_URL = 'http://localhost:8000/api/v1';
export const CLIENT_ID = 'b980b13c-4db8-4e8a-859c-4544fd70825f';

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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'client-id': CLIENT_ID,
                Cookie: cookies
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data?.detail?.info || `Something went wrong: ${response.statusText}`);
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
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'client-id': CLIENT_ID,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data?.detail?.info || `Something went wrong: ${response.statusText}`);
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

const getFullItemList = async () => {
    const {sessionId, userId, sessionToken, keyWrappingKey, keyWrappingKeyPublic} = await fetchData();
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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(
        sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        if (request.greeting === "hello"){
            getFullItemList().then(data => {
                console.log("data", data);
                sendResponse({
                    farewell: "goodbye",
                    itemList: data
                });
            })
        }
        return true;
    }
);