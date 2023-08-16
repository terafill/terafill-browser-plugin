/* eslint-disable */
export const updateItem = (vaultId, itemId, attribute, value) => {
    setVaultList((prevVaultList) => ({
        ...prevVaultList,
        [vaultId]: {
            ...prevVaultList[vaultId],
            itemList: {
                ...prevVaultList[vaultId]['itemList'],
                [itemId]: {
                    ...prevVaultList[vaultId]['itemList'][itemId],
                    [attribute]: value,
                },
            },
        },
    }));
};

export const deleteItem = (vaultId, itemId) => {
    setVaultList((prevVaultList) => {
        const updatedVaultList = {
            ...prevVaultList,
            [vaultId]: {
                ...prevVaultList[vaultId],
                itemList: {
                    ...prevVaultList[vaultId].itemList,
                },
            },
        };

        if (updatedVaultList[vaultId] && updatedVaultList[vaultId].itemList[itemId]) {
            delete updatedVaultList[vaultId].itemList[itemId];
        }

        return updatedVaultList;
    });
};

export const addItem = (vaultId, itemData) => {
    if (itemData['website']) {
        itemData['icon'] = `https://cool-rose-moth.faviconkit.com/${itemData.website}/256`;
    }
    setVaultList((prevVaultList) => ({
        ...prevVaultList,
        [vaultId]: {
            ...prevVaultList[vaultId],
            itemList: { ...prevVaultList[vaultId]['itemList'], [itemData.id]: itemData },
        },
    }));
    deleteItem(vaultId, 'new');
};
