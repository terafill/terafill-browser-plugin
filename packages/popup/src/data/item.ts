// @ts-nocheck
import axios, { isAxiosError } from 'axios';

import { BASE_URL, CLIENT_ID } from '../config';
import { getKeyWrappingKeyPair, encryptData } from '../utils/security';

interface VaultItemParams {
    vaultId: string;
    id?: string;
    iek?: string;
    title?: string;
    website?: string;
    password?: string;
    username?: string;
}

export async function getVaultItem({ vaultId, id }: VaultItemParams): Promise<object> {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items/${id}`;

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
        if (isAxiosError(error)) {
            const errorMessage =
                error?.response?.data?.detail?.info || `Something went wrong: ${error}.`;
            throw Error(errorMessage);
        }
        throw error;
    }
}

export async function updateVaultItem({
    vaultId,
    id,
    title,
    website,
    password,
    username,
    iek,
}: VaultItemParams) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items/${id}`;

    const config = {
        withCredentials: true,
        method: 'put',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'client-id': CLIENT_ID,
        },
        data: {
            title: encryptData(title, iek),
            website: encryptData(website, iek),
            password: encryptData(password, iek),
            username: encryptData(username, iek),
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

export async function createVaultItem({
    vaultId,
    title,
    website,
    password,
    username,
    iek,
}: VaultItemParams) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items`;
    const keyWrappingKeyPair = getKeyWrappingKeyPair();
    const iekEnc = keyWrappingKeyPair.public.encrypt(iek);

    const config = {
        withCredentials: true,
        method: 'post',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'client-id': CLIENT_ID,
        },
        data: {
            title: encryptData(title, iek),
            website: encryptData(website, iek),
            password: encryptData(password, iek),
            username: encryptData(username, iek),
            encryptedEncryptionKey: iekEnc,
            type: 'PASSWORD',
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

export async function deleteVaultItem({ vaultId, id }: VaultItemParams) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}/items/${id}`;
    console.log(requestUrl);

    const config = {
        withCredentials: true,
        method: 'delete',
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
