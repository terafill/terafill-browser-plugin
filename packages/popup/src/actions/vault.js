/* eslint-disable */
const updateVaultState = (vaultId, attribute, value) => {
    setVaultList((prevVaultList) => ({
        ...prevVaultList,
        [vaultId]: {
            ...prevVaultList[vaultId],
            [attribute]: value,
        },
    }));
};

const addVaultState = (vaultData) => {
    setVaultList((prevVaultList) => ({
        ...prevVaultList,
        [vaultData.id]: {
            ...vaultData,
            itemList: [],
        },
    }));
};

const deleteVaultState = (vaultId) => {
    if (Object.entries(vaultList)[0][0] != vaultId) {
        setSelectedVault(Object.entries(vaultList)[0][0]);
    } else {
        setSelectedVault(Object.entries(vaultList)[1][0]);
    }
    setVaultList((prevVaultList) => {
        const updatedVaultList = {
            ...prevVaultList,
        };
        delete updatedVaultList[vaultId];
        return updatedVaultList;
    });
};
