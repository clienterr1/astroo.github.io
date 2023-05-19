import {
    addBreadcrumb,
    captureException,
} from '@sentry/browser';
import axios from 'axios';
import loadImage from 'blueimp-load-image';
import {
    ref,
    watch,
    onBeforeUnmount,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    getExtension,
    getFileNameFromURL,
} from '@zyro-inc/site-modules/utils/modifyString';

import {
    ASSETS_CATEGORY_DOCUMENT,
    ASSETS_CATEGORY_IMAGE,
    ASSETS_DOCUMENT_SIZE_LIMIT_MB,
    ASSETS_IMAGE_FILE_TYPES,
    ASSETS_IMAGE_SIZE_LIMIT_MB,
    GAMIFICATION_TASK_CHANGE_LOGO,
} from '@/constants';
import {
    ELEMENT_TYPE_GALLERY,
    ELEMENT_TYPE_IMAGE,
} from '@zyro-inc/site-modules/constants';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    deleteAssets
} from '@/api/AssetsApi';
import {
    useNotifications
} from '@/use/useNotifications';
import {
    getFilesInDirectory
} from '@/utils/assets';
import {
    useGamification
} from '@/use/useGamification';

const assets = ref([]);
const isDeleteAssetModalOpened = ref(false);
const isAssetBeingDeleted = ref(false);
const assetsToDelete = ref([]);
const folderToDelete = ref(null);
const uploadedAssets = ref([]);
const uploadingAssetCount = ref(0);
const ASSET_NAME_ID_LENGTH = 17;

export const mbToKb = (sizeMb) => sizeMb * 1024 * 1024;

export const isAssetCategoryDocument = (asset) => asset.category === ASSETS_CATEGORY_DOCUMENT;

export const isAssetCategoryImage = (asset) => asset.category === ASSETS_CATEGORY_IMAGE;

export const getAssetSizeLimit = (asset) => {
    if (isAssetCategoryDocument(asset)) {
        return mbToKb(ASSETS_DOCUMENT_SIZE_LIMIT_MB);
    }

    if (isAssetCategoryImage(asset)) {
        return mbToKb(ASSETS_IMAGE_SIZE_LIMIT_MB);
    }

    // Code shouldn't reach this, but it's a safeguard for future category iterations
    return 0;
};

export const getAssetNameFromUrl = (assetUrl, returnWithFileExtension = false) => {
    if (!assetUrl) {
        return '';
    }

    const fullAssetName = getFileNameFromURL(assetUrl);
    const extensionStartIndex = fullAssetName.indexOf('.');
    const assetNameIdEndIndex = extensionStartIndex >= 0 ? extensionStartIndex : fullAssetName.length;
    const assetNameIdStartIndex = assetNameIdEndIndex > ASSET_NAME_ID_LENGTH ?
        assetNameIdEndIndex - ASSET_NAME_ID_LENGTH :
        assetNameIdEndIndex;
    const assetId = fullAssetName.slice(assetNameIdStartIndex, assetNameIdEndIndex);
    const assetNameWithoutId = fullAssetName.replace(assetId, '');
    const fullAssetNameArray = assetNameWithoutId.split('.');

    if (fullAssetNameArray.length === 1) {
        return assetNameWithoutId;
    }

    const assetNameArray = fullAssetNameArray.slice(0, fullAssetNameArray.length - 1);
    const assetName = assetNameArray.join('.');

    return returnWithFileExtension ? `${assetName}.${getExtension(assetNameWithoutId)}` : assetName;
};

export const useAssets = (props, context) => {
    const isDraggedOver = ref(false);
    const {
        state,
        dispatch,
        getters,
    } = useStore();
    const {
        completeAchievement,
        isGamificationVisible,
    } = useGamification();
    const {
        notify
    } = useNotifications();

    const currentDirectory = computed(() => getters['assets/currentDirectory']);
    const currentDirectoryAssets = computed(() => getFilesInDirectory({
        directory: currentDirectory.value,
        assets: assets.value,
        assetPaths: getters['assets/assetPaths'],
    }));

    const upsertAsset = (assetId, data) => {
        const indexOfAsset = assets.value.findIndex(({
            id
        }) => id === assetId);

        if (indexOfAsset > -1) {
            const foundAsset = assets.value[indexOfAsset];

            assets.value.splice(indexOfAsset, 1, {
                ...foundAsset,
                ...data,
            });
        } else {
            const {
                file,
                url,
                isFetchedFromServer,
                isBeingUploaded,
                category,
                lastModified,
            } = data;

            let assetCategory = category;

            if (!assetCategory) {
                const fileExtension = getExtension(file ? file.name : url);

                assetCategory = ASSETS_IMAGE_FILE_TYPES.includes(fileExtension) ? ASSETS_CATEGORY_IMAGE : ASSETS_CATEGORY_DOCUMENT;
            }

            assets.value = [{
                    id: generateRandomId(),
                    isFetchedFromServer,
                    url,
                    file,
                    isBeingUploaded,
                    isGalleryImageSelected: false,
                    isValid: true,
                    hasFailed: false,
                    transferProgress: 0,
                    category: assetCategory,
                    lastModified,
                    initialDirectory: isBeingUploaded ? currentDirectory.value : null,
                },
                ...assets.value,
            ];
        }
    };

    const failedAssets = computed(() => assets.value.filter(({
        hasFailed
    }) => hasFailed));
    const assetsBeingUploaded = computed(() => assets.value.filter(({
        isBeingUploaded
    }) => isBeingUploaded));
    const validAssetsBeingUploaded = computed(() => assetsBeingUploaded.value.filter(({
        isValid
    }) => isValid));
    const invalidAssetsBeingUploaded = computed(() => assetsBeingUploaded.value.filter(({
        isValid
    }) => !isValid));

    const removeInvalidAssetsBeingUploaded = () => {
        addBreadcrumb({
            category: 'useAssets.js',
            message: 'removeInvalidAssetsBeingUploaded',
        });

        const invalidAssetIds = invalidAssetsBeingUploaded.value.map(({
            id
        }) => id);

        assets.value = assets.value.filter(({
            id
        }) => !invalidAssetIds.includes(id));
    };

    const setUploadingAssetInitialData = (asset) => {
        upsertAsset(asset.id, {
            height: asset.loadedImage ? .originalHeight || null,
            width: asset.loadedImage ? .originalWidth || null,
            galleryId: props ? .galleryId || null,
            name: asset.file.name,
            type: asset.file.type,
            /**
             * lastModified and size is used to compare images so you dont upload them twice
             * Not using these two as assetId since its too long and hard do debug
             */
            lastModified: asset.file.lastModified,
            size: asset.file.size,
        });
    };

    const loadImageLocally = (asset) => {
        /**
         * convert svg to base64
         * svg is loaded without downscaling
         * as blueimp throws security errors
         * with some of them
         * and downscaling svg doesnt do anything
         * base64 is used for preview
         */
        if (getExtension(asset.file.name) === 'svg' || getExtension(asset.file.name) === 'ico') {
            const reader = new FileReader();

            reader.addEventListener('load', (event) => {
                upsertAsset(asset.id, {
                    urlBase64: event.target.result,
                });
            });

            reader.readAsDataURL(asset.file);

            return;
        }

        // Convert non svg files to base64, also downscale for performance
        const reader = new FileReader();

        reader.addEventListener('load', (loadEvent) => {
            upsertAsset(asset.id, {
                urlBase64: loadEvent.target.result,
            });
        });

        // Scale the image and pass it to reader
        loadImage.scale(asset.loadedImage.image, {
                maxWidth: 1370,
            })
            .toBlob((scaledImage) => {
                reader.readAsDataURL(scaledImage);
            });
    };

    const deleteAsset = (assetId) => {
        addBreadcrumb({
            category: 'useAssets.js',
            message: 'deleteAsset',
        });
        assets.value = assets.value.filter(({
            id
        }) => id !== assetId);
    };

    const uploadAsset = async (asset, formData) => {
        // Create and save cancel token before uploading
        const source = axios.CancelToken.source();

        formData.append('siteId', state.websiteId);

        upsertAsset(asset.id, {
            cancelSource: source,
            hasFailed: false,
        });

        try {
            const targetURL = isAssetCategoryImage(asset) ?
                `${import.meta.env.VITE_BACKEND_API_URL}/v3/sites/assets/images` :
                `${import.meta.env.VITE_BACKEND_API_URL}/v3/sites/assets/files`;

            const result = await axios
                .post(targetURL, formData, {
                    cancelToken: source.token,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    // Fyi: for some images this goes from 0 to 100 instantly
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.min((progressEvent.loaded / asset.file.size).toFixed(2) * 100, 100);

                        upsertAsset(asset.id, {
                            transferProgress: progress,
                        });
                    },
                });

            upsertAsset(asset.id, {
                transferProgress: 100,
                url: decodeURI(result.data.url),
                isBeingUploaded: false,
            });

            // need to add already upsert asset to contain correct folder path
            const upsertAssetData = assets.value.find(({
                id
            }) => id === asset.id);

            uploadedAssets.value = [
                ...uploadedAssets.value,
                {
                    ...result.data,
                    initialDirectory: upsertAssetData.initialDirectory,
                },
            ];

            return result;
        } catch (error) {
            captureException(error);

            upsertAsset(asset.id, {
                hasFailed: true,
            });

            return {};
        }
    };

    const deleteFailedAssets = () => {
        addBreadcrumb({
            category: 'useAssets.js',
            message: 'deleteFailedAssets',
        });

        assets.value = assets.value.filter(({
            hasFailed
        }) => !hasFailed);
    };

    /**
     * Loads files to assets object,
     * generates preview, uploads to s3
     */
    const uploadAssets = () => {
        try {
            validAssetsBeingUploaded.value.forEach((asset) => {
                /**
                 * Create an id for image so we can access
                 * the image object by id
                 */
                setUploadingAssetInitialData(asset);

                if (isAssetCategoryImage(asset)) {
                    loadImageLocally(asset);
                }

                const formData = new FormData();

                /**
                 * Not sure how to refactor this code as its hard to read
                 * and probably easy to break since I dont know what it
                 * is supposed to do
                 * copied from previous implementation
                 */
                const excludedFormats = [
                    'svg',
                    'gif',
                    'webp',
                ];
                const fileFormat = getExtension(asset.file.name);
                const isFormatExcluded = fileFormat.includes(excludedFormats);
                const getFormatToConvertTo = () => {
                    // Without this backend throws that the file is too large
                    if (fileFormat.toLowerCase() === 'jpg') {
                        return 'jpeg';
                    }

                    return isFormatExcluded ? 'png' : fileFormat;
                };

                /**
                 * Some svgs throw security errors if we try to load them using
                 * blueimp image loader
                 */
                const FORM_ENTRY_NAME = 'image';

                if (!isAssetCategoryImage(asset)) {
                    formData.append('file', asset.file, asset.file.name);
                    uploadAsset(asset, formData);

                    return;
                }

                if (fileFormat === 'svg') {
                    formData.append(FORM_ENTRY_NAME, asset.file, asset.file.name);
                    uploadAsset(asset, formData);
                } else {
                    asset.loadedImage.image.toBlob((blob) => {
                        formData.append(
                            FORM_ENTRY_NAME,
                            isFormatExcluded || !asset.loadedImage.exif ? asset.file : blob,
                            asset.file.name,
                        );
                        uploadAsset(asset, formData);
                    }, `image/${getFormatToConvertTo()}`);
                }
            });
        } catch (error) {
            captureException(error || new Error('Failed to upload assets'), {
                tags: {
                    errorType: 'Failed to upload assets',
                },
            });
        } finally {
            uploadingAssetCount.value = validAssetsBeingUploaded.value.length;
        }
    };

    /**
     * Hint for testing:
     * Change image size limit to a small one in backend
     * try uploading and when popup shows up that it failed
     * change backend back to large file limit
     * and retry in frontend
     */
    const retryFailedAssets = () => {
        uploadAssets(failedAssets.value);
    };

    // Drag events
    const onDragEnter = () => {
        isDraggedOver.value = true;
    };

    const onDragOver = (event) => {
        event.preventDefault();
        isDraggedOver.value = true;
    };

    const onDragLeave = () => {
        isDraggedOver.value = false;
    };

    const prepareAssetsForUpload = async () => {
        const imageAssets = assetsBeingUploaded.value.filter((asset) => isAssetCategoryImage(asset));

        const imageAssetPromises = await Promise.allSettled(imageAssets.map(async (asset) => {
            try {
                return {
                    ...asset,
                    loadedImage: await loadImage(
                        asset.file, {
                            canvas: true,
                            orientation: true,
                            meta: true,
                        },
                    ),
                };
            } catch {
                upsertAsset(asset.id, {
                    hasFailed: true,
                });

                throw new Error('Failed to load image');
            }
        }));

        const imageAssetValues = imageAssetPromises.filter((asset) => asset.status === 'fulfilled').map((asset) => asset.value);

        imageAssetValues.forEach(({
            id,
            loadedImage,
        }) => {
            upsertAsset(id, {
                loadedImage,
            });
        });
    };

    const setAssetInvalid = (assetId) => {
        upsertAsset(assetId, {
            isValid: false,
        });
    };

    const validateAssets = () => {
        assetsBeingUploaded.value.forEach((asset) => {
            const {
                id,
                file,
            } = asset;

            if (file.size > getAssetSizeLimit(asset)) {
                setAssetInvalid(id);

                return;
            }

            // Skip duplicates by file size and modified date (should be good enough)
            const isDuplicate = assets.value.some(
                (uploadedImage) => uploadedImage.lastModified === file.lastModified && uploadedImage.size === file.size,
            );

            if (isDuplicate) {
                setAssetInvalid(id);
            }
        });
    };

    // Used on drop and on file selection
    const onSelectFiles = async (event) => {
        event.preventDefault();
        isDraggedOver.value = false;

        // DataTransfer is for drop events, target comes from dom
        const files = event ? .dataTransfer ? .files || event ? .target ? .files;

        if (!files) {
            return;
        }

        [...files].forEach((file) => upsertAsset(null, {
            file,
            isFetchedFromServer: false,
            isBeingUploaded: true,
        }));

        await prepareAssetsForUpload();
        await validateAssets();

        if (invalidAssetsBeingUploaded.value.length) {
            return;
        }

        uploadAssets();
    };

    const uploadSvgAsset = async ({
        file
    }) => {
        upsertAsset(null, {
            file,
            isFetchedFromServer: false,
            isBeingUploaded: true,
        });

        await prepareAssetsForUpload();
        await validateAssets();

        const asset = validAssetsBeingUploaded.value[0];
        const fileFormat = getExtension(asset.file.name);

        if (invalidAssetsBeingUploaded.value.length || fileFormat !== 'svg') {
            return {};
        }

        const formData = new FormData();

        formData.append('image', asset.file, asset.file.name);

        const uploadedAsset = await uploadAsset(asset, formData);

        if (!uploadedAsset.data) {
            throw new Error('Failed to upload asset');
        }

        return uploadedAsset.data;
    };

    const selectAllGalleryImages = () => {
        assets.value = assets.value.map((asset) => {
            const isAssetInCurrentDirectory = currentDirectoryAssets.value.some((file) => file.url === asset.url);

            return {
                ...asset,
                isGalleryImageSelected: isAssetInCurrentDirectory && (isAssetCategoryImage(asset) || asset.isGalleryImageSelected),
            };
        });
    };

    const deselectSelectedGalleryImages = () => {
        assets.value = assets.value.map((asset) => ({
            ...asset,
            isGalleryImageSelected: false,
        }));
    };

    // Asset UI utilization
    const deleteMediaAsset = async () => {
        isAssetBeingDeleted.value = true;

        const removingAssets = assetsToDelete.value.map((asset) => getFileNameFromURL(asset.url));

        try {
            await deleteAssets(removingAssets, state.websiteId);

            isDeleteAssetModalOpened.value = false;
            // context might not be passed to composable
            context ? .emit('close');

            assetsToDelete.value.forEach((asset) => {
                const isLogoImageAsset = asset.url.includes(getters.headerBlock.settings.logoImagePath);
                const changeLogoStep = state.gamification.achievements.find(({
                    id
                }) => id === GAMIFICATION_TASK_CHANGE_LOGO);

                if (isGamificationVisible && isLogoImageAsset && !changeLogoStep.isCompleted) {
                    completeAchievement(GAMIFICATION_TASK_CHANGE_LOGO);
                }

                deleteAsset(asset.id);
            });
        } catch (error) {
            notify({
                origin: 'AssetDetailsLayout.vue',
                messageI18nKeyPath: 'builder.errorWhileDeletingImage',
            });

            captureException(error);
            console.error(error);
        } finally {
            isAssetBeingDeleted.value = false;
        }
    };

    // Update alt tags for all elements that use provided image
    const updateUsedImageAltTag = ({
        asset,
        newAltTag,
    }) => {
        const {
            url
        } = asset;
        const urlParts = url ? .split('/') || [];
        const assetName = urlParts[urlParts.length - 1];

        const updatedLanguageElements = Object.entries(state.website.languages).flatMap(([locale, languageData]) => {
            const {
                elements
            } = languageData;
            const elementsThatUseImage = Object.entries(elements).filter(([, {
                type,
                settings,
                images,
            }, ]) => {
                if (type === ELEMENT_TYPE_IMAGE) {
                    return settings.path === assetName;
                }

                if (type === ELEMENT_TYPE_GALLERY) {
                    return images.some(({
                        path
                    }) => path === assetName);
                }

                return false;
            });

            return elementsThatUseImage.map(([elementId, element]) => {
                const {
                    settings,
                    type,
                    images,
                } = element;

                if (type === ELEMENT_TYPE_IMAGE) {
                    return [
                        elementId,
                        locale,
                        {
                            ...element,
                            settings: {
                                ...settings,
                                alt: newAltTag,
                            },
                        },
                    ];
                }

                if (type === ELEMENT_TYPE_GALLERY) {
                    return [
                        elementId,
                        locale,
                        {
                            ...element,
                            images: images.map((image) => {
                                if (image.path !== assetName) return image;

                                return {
                                    ...image,
                                    alt: newAltTag,
                                };
                            }),
                        },
                    ];
                }

                return [
                    elementId,
                    locale,
                    element,
                ];
            });
        });

        updatedLanguageElements.forEach(([
            elementId,
            locale,
            element,
        ]) => {
            dispatch('mergeElementData', {
                elementId,
                elementData: element,
                locale,
            });
        });
    };

    // Assets are fetched upon builder initialization
    // To avoid concurency issues, watch `hasInitialized` and `assets` values from `assets` store
    // If `hasInitialized` has not been set before, upsert server assets and set this flag to true.
    watch([
        () => state.assets.hasInitialized,
        () => state.assets.hasLoaded,
    ], ([hasInitialized, hasLoaded]) => {
        if (!hasInitialized && !!hasLoaded) {
            state.assets.assets.forEach((asset) => {
                upsertAsset(null, {
                    ...asset,
                    url: decodeURI(asset.url),
                    isFetchedFromServer: true,
                });
            });

            dispatch('assets/initAssetManager');
        }
    }, {
        immediate: true,
    });

    // To avoid data override and repetitive calls to backend, watch until all assets are uploaded, only then save assets data to backend
    watch(uploadedAssets, (files) => {
        if (files.length === 0 || files.length !== uploadingAssetCount.value) {
            return;
        }

        const filteredUploadedAssets = files.filter((asset) => asset.url);

        dispatch('assets/addAssetsFolderData', {
            assets: filteredUploadedAssets,
        });

        uploadedAssets.value = [];
        uploadingAssetCount.value = 0;
    }, {
        immediate: true,
    });

    const toggleGalleryImageCheckbox = (imageId) => {
        const indexOfImage = assets.value.findIndex(({
            id
        }) => id === imageId);
        const targetImage = assets.value[indexOfImage];

        assets.value.splice(indexOfImage, 1, {
            ...targetImage,
            isGalleryImageSelected: !targetImage.isGalleryImageSelected,
        });
    };

    let newDomReference = null;

    const listenForDragAndDrop = (domReference) => {
        newDomReference = domReference;
        newDomReference.addEventListener('dragenter', onDragEnter);
        newDomReference.addEventListener('dragover', onDragOver);
        newDomReference.addEventListener('dragleave', onDragLeave);
        newDomReference.addEventListener('drop', onSelectFiles);
    };

    onBeforeUnmount(() => {
        if (!newDomReference) {
            return;
        }

        newDomReference.removeEventListener('dragenter', onDragEnter);
        newDomReference.removeEventListener('dragover', onDragOver);
        newDomReference.removeEventListener('dragleave', onDragLeave);
        newDomReference.removeEventListener('drop', onSelectFiles);
    });

    return {
        updateUsedImageAltTag,
        isAssetCategoryDocument,
        isAssetCategoryImage,
        isDraggedOver,
        isDeleteAssetModalOpened,
        isAssetBeingDeleted,
        listenForDragAndDrop,
        onSelectFiles,
        deleteFailedAssets,
        deleteAsset,
        retryFailedAssets,
        assets,
        uploadAssets,
        getAssetNameFromUrl,
        invalidAssetsBeingUploaded,
        removeInvalidAssetsBeingUploaded,
        selectAllGalleryImages,
        deselectSelectedGalleryImages,
        toggleGalleryImageCheckbox,
        hasServerAssetsLoaded: computed(() => state.assets.hasInitialized),
        uploadSvgAsset,
        deleteMediaAsset,
        assetsToDelete,
        folderToDelete,
        uploadingAssetCount,
    };
};