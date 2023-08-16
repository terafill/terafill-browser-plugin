// @ts-nocheck

import axios from 'axios';

import { BASE_URL, CLIENT_ID } from '../config';

export async function getVaults() {
    const requestUrl = `${BASE_URL}/users/me/vaults`;
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

export async function getVaultItems(vaultId: string) {
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

export async function getDefaultVaultId() {
    const { response } = await getVaults();
    const defaultVault = response[0];
    const vaultId = defaultVault.id;
    return vaultId;
}

export async function getDefaultVaultItems() {
    const defaultVaultId = await getDefaultVaultId();
    const { response } = await getVaultItems(defaultVaultId);
    return response;
}

interface Vault {
    vaultId?: string;
    name?: string;
    description?: string;
}

export async function updateVault({ vaultId, name, description }: Vault) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}`;
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
            name: name,
            description: description,
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

export async function addVault({ name, description }: Vault) {
    const requestUrl = `${BASE_URL}/users/me/vaults`;
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
            name: name,
            description: description,
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

export async function deleteVault({ vaultId }: Vault) {
    const requestUrl = `${BASE_URL}/users/me/vaults/${vaultId}`;
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
