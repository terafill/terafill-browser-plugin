// @ts-nocheck

import SRP from '@harshitsaini/srp-js';
import { Buffer } from 'buffer/';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import { v4 as uuidv4 } from 'uuid';

export const getSRPClient = (
    username: string,
    password: string,
    salt: string,
): Promise<SRP.Client | Error> => {
    return new Promise((resolve, reject) => {
        try {
            const params = SRP.params[1024];

            const identity = Buffer.from(username);
            const password_ = Buffer.from(password);
            const salt_ = Buffer.from(salt, 'hex');
            // var verifier = SRP.computeVerifier(params, salt_, identity, password_);
            const secret = Buffer.from(CryptoJS.lib.WordArray.random(32).toString(), 'hex');
            const client = new SRP.Client(params, salt_, identity, password_, secret);
            resolve(client);
        } catch (error) {
            reject(error);
        }
    });
};

export const getAuthClientDetails = (
    username: string,
    password: string,
): Promise<[Buffer, Buffer]> => {
    return new Promise((resolve, reject) => {
        try {
            const params = SRP.params[1024];
            const identity = Buffer.from(username);
            const password_ = Buffer.from(password);
            const salt = Buffer.from(CryptoJS.lib.WordArray.random(32).toString(), 'hex');
            const verifier = SRP.computeVerifier(params, salt, identity, password_);
            console.log('salt', typeof salt, salt);
            console.log('verifier', typeof verifier, verifier);
            resolve([salt, verifier]);
        } catch (error) {
            reject(error);
        }
    });
};

export function getHash(
    passphrase: string,
    algorithm: string,
    salt: string | CryptoJS.lib.WordArray | null,
) {
    if (algorithm === 'SHA-256') {
        const hash = CryptoJS.SHA256(passphrase);
        return hash.toString(CryptoJS.enc.Hex);
    } else if (algorithm === 'PBKDF2') {
        if (salt === null) {
            salt = CryptoJS.lib.WordArray.random(128 / 8);
        }
        const iterations = 1000;
        const keyLength = 256;
        const key = CryptoJS.PBKDF2(passphrase, salt, {
            keySize: keyLength / 32,
            iterations: iterations,
        });
        return key.toString(CryptoJS.enc.Hex);
    } else {
        throw new Error('Unsupported algorithm');
    }
}

export function encryptData(rawData: string, key: string) {
    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(rawData, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv,
    });

    // Concatenate the IV and the ciphertext
    const cipherTextWithIv = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);

    return cipherTextWithIv;
}

export function decryptData(cipherTextWithIv: string, key: string) {
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

export const generateSecretKey = () => {
    const secret_key = uuidv4();
    return secret_key;
};

// export const storeEncryptedData = (key, value, key_hash_salt, value_encryption_key) => {
//   localStorage.setItem(
//     deriveEncryptionKey(key, 'PBKDF2', key_hash_salt),
//     encryptData(value, value_encryption_key),
//   );
// };

// export const fetchDecryptedData = (key, key_hash_salt, value_encryption_key) => {
//   const encrypted_data = localStorage.getItem(deriveEncryptionKey(key, 'PBKDF2', key_hash_salt));

//   return decryptData(encrypted_data, value_encryption_key);
// };

export const getKeyWrappingKeyPair = () => {
    const keyWrappingKey = localStorage.getItem('keyWrappingKey') || '';
    const keyWrappingKeyPublic = localStorage.getItem('keyWrappingKeyPublic') || '';
    return {
        public: forge.pki.publicKeyFromPem(keyWrappingKeyPublic),
        private: forge.pki.privateKeyFromPem(keyWrappingKey),
    };
};

const storeCookies = (key, value) => {
    // eslint-disable-next-line
    chrome.storage.session.set({
        [key]: value,
    });
};

export const storeAuthData = (email: string, password?: string, keyWrappingKey?: string) => {
    console.log("We are setting storage session items!");
    localStorage.clear();
    localStorage.setItem('email', email);
    storeCookies('email', email);
    if (password && keyWrappingKey) {
        const hashedPassword = getHash(password, 'SHA-256', null);
        const keyWrappingKeyDecypted = forge.pki.decryptRsaPrivateKey(
            keyWrappingKey,
            hashedPassword,
        );
        const keyWrappingKey_pem = forge.pki.privateKeyToPem(keyWrappingKeyDecypted);
        localStorage.setItem('keyWrappingKey', keyWrappingKey_pem);
        storeCookies('keyWrappingKey', keyWrappingKey_pem);

        const keyWrappingKeyPublic = forge.pki.setRsaPublicKey(
            keyWrappingKeyDecypted.n,
            keyWrappingKeyDecypted.e,
        );
        const keyWrappingKeyPublicPem = forge.pki.publicKeyToPem(keyWrappingKeyPublic);
        localStorage.setItem('keyWrappingKeyPublic', keyWrappingKeyPublicPem);
        storeCookies('keyWrappingKeyPublic', keyWrappingKeyPublicPem);
    }
};

export const getRSAPrivateKey = (password: string, encrypted = false) => {
    const { privateKey } = forge.pki.rsa.generateKeyPair(2048);
    const privateKeyPem = forge.pki.privateKeyToPem(privateKey);

    if (!encrypted) {
        return privateKeyPem;
    }

    const hashedPassword = getHash(password, 'SHA-256', null);
    const encryptedPrivateKeyPem = forge.pki.encryptRsaPrivateKey(privateKey, hashedPassword);
    return encryptedPrivateKeyPem;
};
