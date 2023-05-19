import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    useI18n
} from 'vue-i18n';
import {
    getExtensionlessFormattedFileName,
    getAssetNameFromAssetsList,
    getFoldersInDirectory,
} from '@/utils/assets';

const decodeString = (string) => {
    try {
        return decodeURIComponent(string);
    } catch {
        return string;
    }
};

export const useAssetManagerFolders = ({
    assets
} = {}) => {
    const {
        getters,
        dispatch,
    } = useStore();
    const {
        t
    } = useI18n();
    const folders = computed(() => getters['assets/folders']);
    const assetPaths = computed(() => getters['assets/assetPaths']);
    const currentDirectory = computed(() => getters['assets/currentDirectory']);
    const currentDirectoryFolders = computed(() => getFoldersInDirectory({
        directory: currentDirectory.value,
        folders: folders.value,
    }));

    const validAssets = computed(() => assets ? .value.filter((asset) => !asset.hasFailed));
    // This one is needed to display all assets including the ones that are in progress of uploading
    const validAssetsWithPaths = computed(() => validAssets.value
        .map((validAsset) => {
            const urlParts = validAsset.url ? .split('/') || [];
            const uniqueAssetName = urlParts[urlParts.length - 1];
            const directoryFile = !!uniqueAssetName && assetPaths.value[uniqueAssetName];

            if (directoryFile) {
                const pathParts = directoryFile.path.split('/');
                const assetNameFromPath = pathParts[pathParts.length - 1];
                const extensionSplitNameParts = assetNameFromPath.split('.');
                const isFileWithExtension = extensionSplitNameParts.length > 1;
                const extensionlessAssetName = isFileWithExtension ? extensionSplitNameParts.slice(0, -1).join('.') : assetNameFromPath;
                const decodedName = decodeString(extensionlessAssetName);

                return {
                    ...validAsset,
                    name: decodedName,
                    altTag: directoryFile.altTag,
                    path: directoryFile.path,
                };
            }

            const {
                initialDirectory,
                ...restValidAssetData
            } = validAsset;

            return {
                ...restValidAssetData,
                path: `${initialDirectory}${validAsset.file?.name}`,
                altTag: validAsset.altTag,
                name: '',
            };
        }));
    const currentDirectoryValidAssets = computed(() => validAssetsWithPaths.value.filter(
        (asset) => {
            const locationPathIndex = asset.path.lastIndexOf('/') + 1;
            const path = asset.path.slice(0, locationPathIndex);

            return path === currentDirectory.value;
        },
    ));

    const deleteAssetFromFoldersData = async ({
        id
    }) => {
        const updatedAssetPaths = Object.fromEntries(
            Object.entries(assetPaths.value).filter(([uniqueName]) => uniqueName !== id),
        );

        await dispatch('assets/addAssetsData', {
            assetsData: updatedAssetPaths,
        });
    };

    const deleteFolderFromFoldersData = ({
        path
    }) => {
        const updatedAssetFolders = folders.value.filter(({
            path: folderPath
        }) => !folderPath.startsWith(path));
        const updatedAssetPaths = Object.fromEntries(
            Object.entries(assetPaths.value).filter(([, {
                path: assetPath
            }]) => !assetPath.startsWith(path)),
        );

        dispatch('assets/overrideFoldersData', {
            folders: updatedAssetFolders,
            assetPaths: updatedAssetPaths,
        });
    };

    const getNewFolderName = ({
        newName,
        id = null,
    } = {}) => {
        const modifiedFolderName = newName.replace(/[^\d A-Za-z]/g, '\\$&');
        const sameNameRegex = new RegExp(`^(${modifiedFolderName})$`);
        const filteredDirectoryFolders = currentDirectoryFolders.value.filter((folder) => folder.id !== id);
        const folderWithSameName = filteredDirectoryFolders.some((folder) => folder.id !== id && folder.name.match(sameNameRegex));

        if (!folderWithSameName) {
            return newName;
        }

        const numberedNamesRegex = new RegExp(`^(${modifiedFolderName}( ([(]\\d+[)])+)?)$`);

        // find all the instances of numbered names ((1) and etc)
        const numberedNameFolderInstances = filteredDirectoryFolders
            .filter((folder) => folder.name.match(numberedNamesRegex) && folder.id !== id && folder.name !== newName)
            .sort((a, b) => a.name.localeCompare(b.name));

        // extract those numbers to array
        const allNumbersOfSameNameFolders = numberedNameFolderInstances.map((folder) => {
            const nameWithoutNumberClosingParenthesis = folder.name.slice(0, -1);
            const namePartsWithNumberArray = nameWithoutNumberClosingParenthesis.split('(');
            const numberInFolderName = namePartsWithNumberArray[namePartsWithNumberArray.length - 1];

            return Number.parseInt(numberInFolderName, 10);
        }).filter((number) => number);

        const sameNameCount = Math.max(...allNumbersOfSameNameFolders, 0) + 1;

        return `${newName}${sameNameCount ? ` (${sameNameCount})` : ''}`;
    };

    const addNewFolder = () => {
        const baseFileName = t('builder.foldersNewFolder');
        const folderName = getNewFolderName({
            newName: baseFileName,
        });

        dispatch('assets/addNewFolder', {
            folderName,
            formattedFolderName: getExtensionlessFormattedFileName(folderName),
        });
    };

    const setFileName = ({
        newName,
        id,
        assetData,
    }) => {
        const {
            path
        } = assetData;
        const splitPath = path.split('.');
        const fileExtension = splitPath.length > 1 ? splitPath[splitPath.length - 1] : '';
        const pathParts = path.split('/');
        const folderNames = pathParts.slice(0, -1);
        const finalFileName = fileExtension ? `${encodeURIComponent(newName)}.${fileExtension}` : encodeURIComponent(newName);

        const newPath = [
            ...folderNames,
            finalFileName,
        ].join('/');

        dispatch('assets/addAssetsData', {
            assetsData: {
                ...assetPaths.value,
                [id]: {
                    ...assetPaths.value[id],
                    path: newPath,
                },
            },
        });
    };

    const setImageAltTag = ({
        newAltTag,
        id,
    }) => {
        const uniqueName = getAssetNameFromAssetsList({
            assetsList: assets,
            id,
        });
        const assetData = assetPaths.value[uniqueName];

        if (!assetData) {
            return;
        }

        dispatch('assets/addAssetsData', {
            assetsData: {
                ...assetPaths.value,
                [uniqueName]: {
                    ...assetPaths.value[uniqueName],
                    altTag: newAltTag,
                },
            },
        });
    };

    const setFolderName = ({
        newName,
        id,
    }) => {
        const {
            path
        } = folders.value.find((folder) => folder.id === id);
        const finalFolderName = getNewFolderName({
            newName,
            id,
        });

        // Get affected files of the folder
        const affectedFileKeys = Object.keys(assetPaths.value).filter((key) => assetPaths.value[key].path.startsWith(path));
        const newPath = path.split('/');
        const formattedFolderName = getExtensionlessFormattedFileName(finalFolderName);

        newPath.splice(-2, 1, formattedFolderName);
        // Update folders list with new folder data
        const updatedFolders = folders.value.map((folder) => {
            if (folder.id === id) {
                return {
                    ...folder,
                    path: folder.path.replaceAll(path, newPath.join('/')),
                    name: finalFolderName,
                };
            }

            if (folder.path.startsWith(path)) {
                return {
                    ...folder,
                    path: folder.path.replace(path, newPath.join('/')),
                    parentPath: folder.parentPath.replace(path, newPath.join('/')),
                };
            }

            return folder;
        });

        // Update affected files
        const updatedAffectedAssetPathEntries = Object.entries(assetPaths.value).map(([key, asset]) => {
            if (affectedFileKeys.includes(key)) {
                return [
                    key,
                    {
                        path: asset.path.replaceAll(path, newPath.join('/')),
                    },
                ];
            }

            return [
                key,
                asset,
            ];
        });
        const updatedAffectedAssetPaths = Object.fromEntries(updatedAffectedAssetPathEntries);

        dispatch('assets/overrideFoldersData', {
            folders: updatedFolders,
            assetPaths: updatedAffectedAssetPaths,
        });
    };

    const setAssetName = ({
        newName,
        id,
    }) => {
        const uniqueName = getAssetNameFromAssetsList({
            assetsList: assets,
            id,
        });

        const assetData = assetPaths.value[uniqueName];

        // Rename asset
        if (assetData) {
            setFileName({
                newName,
                id: uniqueName,
                assetData,
            });

            return;
        }

        // Rename folder and its assets
        setFolderName({
            newName,
            id,
        });
    };

    const moveFileTo = ({
        path,
        newPath,
        id,
    }) => {
        const splitPath = path.split('/');
        const fileNameFromPath = splitPath[splitPath.length - 1];
        const destinationPath = `${newPath}${fileNameFromPath}`;

        const updatedAffectedAssetPathEntries = Object.entries(assetPaths.value).map(([key, asset]) => {
            if (id === key) {
                return [
                    key,
                    {
                        path: asset.path.replaceAll(path, destinationPath),
                    },
                ];
            }

            return [
                key,
                asset,
            ];
        });
        const updatedAffectedAssetPaths = Object.fromEntries(updatedAffectedAssetPathEntries);

        dispatch('assets/addAssetsData', {
            assetsData: updatedAffectedAssetPaths,
        });
    };

    return {
        currentDirectory,
        validAssetsWithPaths,
        currentDirectoryValidAssets,
        currentDirectoryFolders,
        folders,
        assetPaths,
        deleteAssetFromFoldersData,
        deleteFolderFromFoldersData,
        addNewFolder,
        setAssetName,
        setImageAltTag,
        moveFileTo,
    };
};