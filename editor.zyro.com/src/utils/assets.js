import {
    REGEX_IS_FILE_WITH_EXTENSION,
    REGEX_IS_FOLDER_FILE,
} from '@zyro-inc/site-modules/constants/regex';
import {
    generateRandomId
} from '@/utils/generateRandomId';

export const getFilesInDirectory = ({
    directory,
    assetPaths,
    assets,
    includeFromSubfolders = false,
}) => Object.entries(assetPaths).filter(([, asset]) => {
    const doesAssetBelongToTheDirectory = asset.path.startsWith(directory);

    if (includeFromSubfolders) {
        return doesAssetBelongToTheDirectory;
    }

    if (!doesAssetBelongToTheDirectory) {
        return false;
    }

    const isRootFileWithExtension = asset.path.split(directory)[1] ? .match(REGEX_IS_FILE_WITH_EXTENSION);
    const isFileInsideExactFolder = asset.path.match(REGEX_IS_FOLDER_FILE);

    return isRootFileWithExtension || isFileInsideExactFolder;
}).map(([uniqueName, assetData]) => {
    const asset = assets.find(({
        url
    }) => {
        const nameFromUrl = url.split('/').slice(-1)[0];

        return nameFromUrl === uniqueName;
    });

    return {
        ...asset,
        ...assetData,
    };
});

export const getFoldersFromAssetsData = ({
    assetsData
}) => {
    // Get an array of all folder paths from the assetsData
    const folderPaths = Object.values(assetsData)
        .flatMap((assetData) => {
            const indexOfLastSlash = assetData.path.lastIndexOf('/');
            const pathParts = assetData.path.slice(0, indexOfLastSlash).split('/').filter((path) => path);

            return pathParts.map((_, index, paths) => {
                const folderPath = `/${paths.slice(0, index + 1).join('/')}/`;

                return folderPath;
            });
        });

    // Remove duplicate folder paths and create an array of folder objects
    const uniqueFolderPaths = [...new Set(folderPaths)];
    const folders = uniqueFolderPaths
        .map((folderPath) => {
            const pathParts = folderPath.split('/').filter((part) => part !== '');
            const parentPath = pathParts.slice(0, -1).join('/');

            return {
                path: folderPath,
                name: decodeURIComponent(pathParts[pathParts.length - 1]),
                id: generateRandomId(),
                parentPath: parentPath.length ? `/${parentPath}/` : '/',
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return folders;
};

export const getFoldersInDirectory = ({
    directory,
    folders,
}) => folders.filter((folder) => folder.parentPath === directory);

export const getExtensionlessFormattedFileName = (name) => {
    const modifiedString = encodeURIComponent(name);
    const fileParts = modifiedString.split('.');

    if (fileParts.length === 1) {
        return modifiedString;
    }

    return modifiedString.split('.').slice(0, -1).join('.');
};

export const getAssetNameFromAssetsList = ({
    assetsList,
    id,
}) => {
    // assets data is saved with unique-name and path key value pairs, so need to get the name from asset url
    // if there is no url, means its not a file but a folder
    const assetUrl = assetsList.value.find((asset) => asset.id === id) ? .url;
    const urlParts = assetUrl ? .split('/') || [];

    return urlParts[urlParts.length - 1];
};