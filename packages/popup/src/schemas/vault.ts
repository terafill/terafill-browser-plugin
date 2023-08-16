interface Vault {
    id?: string;
    vaultId?: string;
    name?: string;
    description?: string;
}

interface VaultList {
    [key: string]: Vault;
}

interface Vault {
    vaultId?: string;
    name?: string;
    description?: string;
}
