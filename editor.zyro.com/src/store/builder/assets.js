import {
    captureException
} from '@sentry/browser';

import {
    FONT_TYPE_CUSTOM,
    addCustomFontsFontFaces,
} from '@zyro-inc/site-modules/utils/font';
import {
    getOptimizedSrc
} from '@zyro-inc/site-modules/utils/getSrcsets';
import {
    getExtension
} from '@zyro-inc/site-modules/utils/modifyString';
import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';
import {
    getAssets,
    addAssetsPathData,
} from '@/api/AssetsApi';
import {
    ASSETS_IMAGE_FILE_TYPES,
    ASSETS_FONT_FILE_TYPES,
    ASSETS_THUMBNAIL_WIDTH,
} from '@/constants';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import isEqual from 'lodash.isequal';
import {
    getAssetNameFromUrl
} from '@/use/useAssets';
import {
    getFoldersFromAssetsData
} from '@/utils/assets';

export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_HAS_LOADED = 'SET_HAS_LOADED';
export const SET_HAS_FAILED = 'SET_HAS_FAILED';
export const SET_HAS_INITIALIZED = 'SET_HAS_INITIALIZED';
export const SET_ASSETS = 'SET_ASSETS';

export default {
    namespaced: true,
    state: {
        hasInitialized: false,
        hasLoaded: false,
        hasFailed: false,
        isLoading: false,
        assets: [],
        folders: [],
        assetPaths: [],
        currentDirectory: '/',
    },
    getters: {
        hasAssets: (state) => state.assets.length > 0,
        customFonts: (state) => state.assets.map((file) => {
            const [fileName, fileType] = file.path.split('.');

            return {
                type: FONT_TYPE_CUSTOM,
                family: decodeURI(fileName),
                fileType,
            };
        }).filter(({
            fileType
        }) => ASSETS_FONT_FILE_TYPES.includes(fileType)),

        images: (state) => state.assets.filter((file) => {
            const fileType = getExtension(file.path);

            return ASSETS_IMAGE_FILE_TYPES.includes(fileType);
        }),
        assetPaths: (state) => state.assetPaths,
        folders: (state) => state.folders,
        currentDirectory: (state) => state.currentDirectory,
    },
    mutations: {
        [SET_IS_LOADING]: (state, value) => {
            state.isLoading = value;
        },
        [SET_HAS_LOADED]: (state, value) => {
            state.hasLoaded = value;
        },
        [SET_HAS_FAILED]: (state, value) => {
            state.hasFailed = value;
        },
        [SET_ASSETS]: (state, value) => {
            state.assets = value;
        },
        [SET_HAS_INITIALIZED]: (state, value) => {
            state.hasInitialized = value;
        },
        setCurrentDirectory: (state, value) => {
            state.currentDirectory = value;
        },
        setFolders: (state, value) => {
            state.folders = value;
        },
        setAssetPaths: (state, value) => {
            state.assetPaths = value;
        },
    },
    actions: {
        fetchAssets: async ({
            state,
            rootState,
            getters,
            dispatch,
            commit,
        }) => {
            if (state.isLoading) {
                return;
            }

            commit(SET_IS_LOADING, true);

            try {
                const siteAssets = await getAssets(rootState.websiteId);

                commit(SET_ASSETS, siteAssets);
                commit(SET_HAS_LOADED, true);
                commit(SET_HAS_FAILED, false);

                dispatch('addAssetsFolderData', {
                    assets: siteAssets,
                });

                // Necessary side effect to DOM
                // Uploaded fonts need to be loaded to builder, for font representation purpose
                addCustomFontsFontFaces({
                    customFonts: getters.customFonts,
                    siteId: rootState.websiteId,
                });
                dispatch('preloadImages');
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    message: 'An error occurred while trying to load your files',
                    origin: 'store/assets.js',
                }, {
                    root: true,
                });

                commit(SET_HAS_LOADED, false);
                commit(SET_HAS_FAILED, true);

                captureException(error || new Error('An error occurred while trying to load your files'), {
                    tags: {
                        errorType: 'Asset load error',
                    },
                });
            } finally {
                commit(SET_IS_LOADING, false);
            }
        },
        // only after initial fetch, assets should remapped and 'upserted' to asset manager (see useAssets.js)
        initAssetManager: ({
            commit
        }) => commit(SET_HAS_INITIALIZED, true),
        preloadImages: ({
            rootState,
            getters,
        }) => {
            const placeholderImage = new Image();

            getters.images.forEach((image) => {
                const thumbnailSrc = getOptimizedSrc('assets', image.path, rootState.websiteId, {
                    width: ASSETS_THUMBNAIL_WIDTH,
                });

                // create new DOM image and add same src as in asset manager. this will cause browser to force fetch it
                placeholderImage.src = thumbnailSrc;
            });
        },
        addAssetsData: async ({
            rootState,
            commit,
            dispatch,
        }, {
            assetsData
        } = {}) => {
            try {
                await addAssetsPathData({
                    siteId: rootState.websiteId,
                    assetsData,
                });

                commit('setAssetPaths', assetsData);
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    message: 'An error occurred while trying to update your files location',
                    origin: 'store/assets.js',
                }, {
                    root: true,
                });
            }
        },
        addAssetsFolderData: ({
            getters,
            commit,
            dispatch,
        }, {
            assets
        }) => {
            const {
                currentDirectory,
                assetPaths,
            } = getters;
            const initialAssetPaths = getters.assetPaths;

            const folderlessAssets = assets.filter((asset) => !assetPaths[asset.name]);
            const folderlessAssetsPathEntries = folderlessAssets.map((asset) => {
                const key = asset.name;
                const decodedUrl = decodeURI(asset.url);
                const name = getAssetNameFromUrl(decodedUrl, true);
                const encodedName = encodeURIComponent(name);
                const path = `${asset.initialDirectory || currentDirectory}${encodedName}`; // uploaded assets have initialDirectory added

                return [
                    key,
                    {
                        path,
                    },
                ];
            });
            const folderlessAssetsPaths = Object.fromEntries(folderlessAssetsPathEntries);
            const assetsData = {
                ...initialAssetPaths,
                ...folderlessAssetsPaths,
            };

            if (Object.keys(folderlessAssetsPaths).length) {
                dispatch('addAssetsData', {
                    assetsData,
                });
            }

            const newFolders = getFoldersFromAssetsData({
                assetsData,
            });

            const mergedFolders = [
                ...getters.folders,
                ...newFolders,
            ].filter((folder, index, self) => index === self.findIndex((selfFolder) => (
                selfFolder.path === folder.path
            )));

            commit('setFolders', mergedFolders);
        },
        overrideFoldersData: ({
            getters,
            commit,
            dispatch,
        }, {
            folders,
            assetPaths,
        }) => {
            commit('setFolders', folders);

            if (isEqual(assetPaths, getters.assetPaths)) {
                return;
            }

            dispatch('addAssetsData', {
                assetsData: assetPaths,
            });
        },
        addNewFolder: ({
            getters,
            commit,
        }, {
            folderName,
            formattedFolderName,
        }) => {
            commit('setFolders', [
                ...getters.folders,
                ...[{
                    path: `${getters.currentDirectory}${formattedFolderName}/`,
                    name: folderName,
                    id: generateRandomId(),
                    parentPath: getters.currentDirectory,
                }, ],
            ]);
        },
        setCurrentDirectory: ({
            commit
        }, path) => {
            commit('setCurrentDirectory', path);
        },
    },
};