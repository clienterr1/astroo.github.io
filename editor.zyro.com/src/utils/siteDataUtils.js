import {
    addBreadcrumb
} from '@sentry/browser';
import {
    rehype
} from 'rehype';
import {
    visit
} from 'unist-util-visit';

import {
    SYSTEM_LOCALE,
    SEO_MAX_STRING_LENGTH_DESCRIPTION,
    META_ECOMMERCE_TYPE,
    ECOMMERCE_TYPE_ECWID,
    ECOMMERCE_TYPE_ZYRO,
    PAGE_TYPE_BLOG,
    PAGE_TYPE_ECOMMERCE_PRODUCT,
    ANIMATION_APPLICABLE_BLOCK_TYPES,
    ANIMATION_TYPE_GLOBAL,
} from '@zyro-inc/site-modules/constants';
import {
    BLOCKS_ECOMMERCE
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';
import {
    getPagePathFromId
} from '@zyro-inc/site-modules/utils/page/getPagePathFromId';

import {
    getBlogHeaderBlock,
    getBlogPostGridBlock,
    getEcommerceProductBlock,
    getBlogPostLayoutBlock,
} from '@/components/block/blocks';
import {
    BLOG_PLACEHOLDERS
} from '@/data';
import {
    getRandomArrayItem
} from '@/utils/array';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    patcher
} from '@/utils/jsondiffpatch';
import {
    getValidPagePath
} from '@/utils/urlValidators';
import {
    getBlocksAndElementsWithGlobalAnimations,
    mapAnimatableBlocksWithAnimation,
    mapAnimatableElementsWithAnimation,
} from '@/utils/siteEngineAnimations';

/**
 * Clone siteData and add navigation item to it
 * @param { string } [locale] - locale to add navigation item to. By default add to `system` locale
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } [itemId] - navigation item to add ID
 * @param { object } itemData - navigation item to add data
 * @param { boolean } [isHidden] - navigation item to add visibility in navigation
 * @returns cloned siteData with navigation item added
 */
export const addNavigationItem = ({
    locale = SYSTEM_LOCALE,
    siteData,
    itemData,
    isHidden = false,
}) => {
    addBreadcrumb({
        category: 'ADD_NAVIGATION_ITEM',
        data: {
            itemData,
            isHidden,
        },
        level: 'debug',
        type: 'debug',
    });

    const siteDataClone = patcher.clone(siteData);
    const subItems = itemData.subItems.filter((item) => item.linkType !== 'Page');

    siteDataClone.languages[locale].nav.push({
        ...itemData,
        navItemId: itemData.navItemId ? ? generateRandomId(),
        isHidden,
        subItems,
    });

    return siteDataClone;
};

/**
 * Clone siteData and add block to it
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } pageId - pageId of page to which a new block should be added
 * @param { string } [blockId] - block to add ID
 * @param { object } blockData - block to add data
 * @param { string } [previousBlockId] - previous block ID, after which new block will be inserted
 * @param { object } [elements] - element entries, that are referenced in blockData.components array
 * @param { object } [blocks] - block entries, that are referenced in blockData.slides
 * @param { string } [slideshowBlockId] - blockId of a block to which a new bock should be added
 * @param { object } [slideMetadata] - metadata of a block which is being added to slideshow block
 * @param { string } [locale] - locale to add block to. By default add to `system` locale
 * @returns cloned siteData with block added
 */
export const addBlock = ({
    siteData,
    pageId,
    blockId = generateRandomId(),
    blockData,
    previousBlockId,
    elements,
    blocks,
    slideshowBlockId,
    slideMetadata,
    locale = SYSTEM_LOCALE,
}) => {
    addBreadcrumb({
        category: 'ADD_BLOCK',
        data: {
            pageId,
            blockId,
            blockData,
            previousBlockId,
            elements,
            blocks,
            slideshowBlockId,
            slideMetadata,
        },
        level: 'debug',
        type: 'debug',
    });
    const siteDataClone = patcher.clone(siteData);
    let blockDataCopy = {
        ...blockData,
    };
    let elementsCopy = {
        ...elements,
    };

    // Handle global animations
    const itemWithGlobalAnimation = getBlocksAndElementsWithGlobalAnimations({
        blocks: siteDataClone.languages[locale].blocks,
        elements: siteDataClone.languages[locale].elements,
    });

    if (itemWithGlobalAnimation) {
        if (ANIMATION_APPLICABLE_BLOCK_TYPES.includes(blockData.type)) {
            blockDataCopy = {
                ...blockDataCopy,
                animation: {
                    name: itemWithGlobalAnimation.animation.name,
                    type: ANIMATION_TYPE_GLOBAL,
                },
            };
        }

        elementsCopy = mapAnimatableElementsWithAnimation({
            elements: elementsCopy,
            itemWithAnimation: itemWithGlobalAnimation,
        });
    }

    // Handle website.elements
    siteDataClone.languages[locale].elements = {
        ...siteDataClone.languages[locale].elements,
        ...elementsCopy,
    };

    // Handle website.blocks
    siteDataClone.languages[locale].blocks = {
        ...siteDataClone.languages[locale].blocks,
        ...blocks,
        [blockId]: blockDataCopy,
    };
    if (siteDataClone.languages[locale].blocks[blockId] ? .htmlId) {
        delete siteDataClone.languages[locale].blocks[blockId].htmlId;
    }

    // Block can be added to 1 of 2 possible parents - page OR slideshow block
    if (slideshowBlockId) {
        const slideshowBlockData = siteDataClone.languages[locale].blocks[slideshowBlockId];

        siteDataClone.languages[locale].blocks[slideshowBlockId] = {
            ...slideshowBlockData,
            slides: [
                ...slideshowBlockData.slides,
                {
                    blockId,
                    ...slideMetadata,
                },
            ],
        };
    } else if (pageId) {
        const pageBlocks = siteDataClone.languages[locale].pages[pageId].blocks;
        let newBlockIndex = pageBlocks.length;

        // pageBlocks array does not contain 'header' block
        // if previous block is 'header', insert block as a first item in pageBlocks array
        if (previousBlockId === 'header') {
            newBlockIndex = 0;
        } else if (pageBlocks.indexOf(previousBlockId !== -1)) {
            newBlockIndex = pageBlocks.indexOf(previousBlockId) + 1;
        }

        siteDataClone.languages[locale].pages[pageId].blocks.splice(newBlockIndex, 0, blockId);
    }

    // Handle website.meta ecommerce type
    if (!siteDataClone.meta[META_ECOMMERCE_TYPE]) {
        if (blockData ? .type === 'BlockEcwidStore') {
            siteDataClone.meta[META_ECOMMERCE_TYPE] = ECOMMERCE_TYPE_ECWID;
        } else if (BLOCKS_ECOMMERCE.includes(blockData ? .type)) {
            siteDataClone.meta[META_ECOMMERCE_TYPE] = ECOMMERCE_TYPE_ZYRO;
        }
    }

    return siteDataClone;
};

/**
 * Clone siteData and remove block
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } blockId - block to remove ID
 * @returns cloned siteData with block removed
 */
export const removeBlock = ({
    siteData,
    blockId,
    locale = SYSTEM_LOCALE,
}) => {
    addBreadcrumb({
        category: 'REMOVE_BLOCK',
        data: blockId,
        level: 'debug',
        type: 'debug',
    });

    const siteDataClone = patcher.clone(siteData);
    const isBlockEcwid = siteDataClone.languages[locale].blocks[blockId] ? .type === 'BlockEcwidStore';

    // Blocks to remove (block might have references to other blocks, ex. slideshow)
    const blocksIdsToRemove = [
        blockId,
        ...(siteDataClone.languages[locale].blocks[blockId].type !== 'BlockImageSlideshow' ?
            (siteDataClone.languages[locale].blocks[blockId].slides ? .map((slide) => slide.blockId) || []) :
            []
        ),
    ];

    // Handle website.elements
    blocksIdsToRemove
        .flatMap((id) => siteDataClone.languages[locale].blocks[id].components)
        .forEach((elementId) => {
            delete siteDataClone.languages[locale].elements[elementId];
        });

    // Handle website.blocks
    siteDataClone.languages[locale].blocks = Object.entries(siteDataClone.languages[locale].blocks)
        .reduce((filteredBlocks, [id, blockValue]) => {
            // Don't add block to filteredBlocks, if it is contained in blocks to remove list
            if (blocksIdsToRemove.includes(id)) {
                return filteredBlocks;
            }

            // Add block to filteredBlocks, if it is not in blocks to remove list
            return {
                ...filteredBlocks,
                [id]: {
                    ...blockValue,
                    // Filter out block to remove from all slideshows
                    ...(blockValue.slides && {
                        slides: blockValue.slides.filter((slide) => slide.blockId !== blockId),
                    }),
                },
            };
        }, {});

    // Handle website.pages
    siteDataClone.languages[locale].pages = Object.entries(siteDataClone.languages[locale].pages)
        .reduce((allPages, [pageId, pageValue]) => ({
            ...allPages,
            [pageId]: {
                ...pageValue,
                blocks: pageValue.blocks ? .filter((id) => id !== blockId),
            },
        }), {});

    // This is temporary and will be eliminated once ecwid delete logic will be introduced:
    // remove ecwid flag if no blocks left in the site
    if (isBlockEcwid && siteDataClone.languages[locale].blocks && !Object.values(siteDataClone.languages[locale].blocks).some((block) => block.type === 'BlockEcwidStore')) {
        siteDataClone.meta[META_ECOMMERCE_TYPE] = null;
    }

    return siteDataClone;
};

/**
 * Clone siteData and remove element
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } blockId - element to remove ID
 * @returns cloned siteData with block removed
 */
export const removeElement = ({
    siteData,
    elementId,
    locale = SYSTEM_LOCALE,
}) => {
    const siteDataClone = patcher.clone(siteData);

    // Handle website.blocks
    siteDataClone.languages[locale].blocks = Object.entries(siteDataClone.languages[locale].blocks)
        .reduce((allBlocks, [blockId, blockValue]) => {
            let updatedBlockValue = blockValue;

            if (blockValue.components && blockValue.zindexes) {
                updatedBlockValue = {
                    ...blockValue,
                    components: blockValue.components.filter((id) => id !== elementId),
                    zindexes: blockValue.zindexes.filter((id) => id !== elementId),
                };
            }

            return {
                ...allBlocks,
                [blockId]: updatedBlockValue,
            };
        }, {});

    // Handle website.elements
    delete siteDataClone.languages[locale].elements[elementId];

    return siteDataClone;
};

/**
 * Clone siteData and add page
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } pageId - page to add ID
 * @param { object } pageData - page data to add
 * @param { object } blocks - block entries, that are referenced in pageData.blocks
 * @param { object } elements - element entries, that are referenced in all page blocks blockData.components
 * @param { object } navigationItemData - page navigation data to add
 * @returns cloned siteData with page added
 */
export const addPage = ({
    locale = SYSTEM_LOCALE,
    siteData,
    pageId,
    pageData,
    blocks,
    elements,
    navigationItem,
    isPageTypeEcwid = false,
    isPageTypeEcommerce = false,
}) => {
    const newPageData = {
        ...pageData,
    };

    addBreadcrumb({
        category: 'ADD_PAGE',
        data: {
            pageId,
            pageData: newPageData,
            blocks,
            elements,
            navigationItem,
        },
        level: 'debug',
        type: 'debug',
    });

    let siteDataClone = patcher.clone(siteData);
    let blocksCopy = {
        ...blocks,
    };
    let elementsCopy = {
        ...elements,
    };

    siteDataClone.languages[locale].pages = {
        ...siteDataClone.languages[locale].pages,
        [pageId]: newPageData,
    };

    // Handle global animations
    const itemWithGlobalAnimation = getBlocksAndElementsWithGlobalAnimations({
        blocks: siteDataClone.languages[locale].blocks,
        elements: siteDataClone.languages[locale].elements,
    });

    if (itemWithGlobalAnimation) {
        blocksCopy = mapAnimatableBlocksWithAnimation({
            blocks: blocksCopy,
            itemWithAnimation: itemWithGlobalAnimation,
        });
        elementsCopy = mapAnimatableElementsWithAnimation({
            elements: elementsCopy,
            itemWithAnimation: itemWithGlobalAnimation,
        });
    }

    // Handle website.blocks
    if (blocksCopy) {
        siteDataClone.languages[locale].blocks = {
            ...siteDataClone.languages[locale].blocks,
            ...blocksCopy,
        };
    }

    // Handle website.elements
    if (elementsCopy) {
        siteDataClone.languages[locale].elements = {
            ...siteDataClone.languages[locale].elements,
            ...elementsCopy,
        };
    }

    // Handle website.navigation
    if (navigationItem) {
        siteDataClone = addNavigationItem({
            locale,
            siteData: siteDataClone,
            itemData: {
                ...navigationItem,
                linkedPageId: pageId,
            },
            isHidden: navigationItem.isHidden,
        });
    }

    // Handle website.meta ecommerce type
    if (!siteDataClone.meta[META_ECOMMERCE_TYPE]) {
        if (isPageTypeEcwid) {
            siteDataClone.meta[META_ECOMMERCE_TYPE] = ECOMMERCE_TYPE_ECWID;
        } else if (isPageTypeEcommerce) {
            siteDataClone.meta[META_ECOMMERCE_TYPE] = ECOMMERCE_TYPE_ZYRO;
        }
    }

    return siteDataClone;
};

/**
 * Clone siteData and remove page
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } pageId - page to remove ID
 * @returns cloned siteData with page removed
 */
export const removePage = ({
    siteData,
    pageId,
    locale = SYSTEM_LOCALE,
}) => {
    addBreadcrumb({
        category: 'REMOVE_PAGE',
        data: {
            pageId,
        },
        level: 'debug',
        type: 'debug',
    });
    let siteDataClone = patcher.clone(siteData);

    // Handle website.blocks
    siteDataClone.languages[locale].pages[pageId] ? .blocks ? .forEach((blockId) => {
        siteDataClone = removeBlock({
            siteData: siteDataClone,
            blockId,
            locale,
        });
    });

    // Handle website.pages
    delete siteDataClone.languages[locale].pages[pageId];

    // Handle website.language.nav
    // Remove navigation links that link to the page
    const updatedNavigation = siteDataClone.languages[locale].nav.reduce((navList, navItem) => {
        if (navItem.linkedPageId !== pageId && !navItem.subItems) {
            return [
                ...navList,
                navItem,
            ];
        }

        if (navItem.linkedPageId !== pageId) {
            const filteredSubitems = navItem.subItems.filter(({
                linkedPageId
            }) => linkedPageId !== pageId);

            return [
                ...navList,
                {
                    ...navItem,
                    subItems: filteredSubitems,
                },
            ];
        }

        if (!navItem.subItems) {
            return navList;
        }

        const filteredSubitems = navItem.subItems.filter(({
            linkedPageId
        }) => linkedPageId !== pageId);

        return [
            ...navList,
            ...filteredSubitems,
        ];
    }, []);

    siteDataClone.languages[locale].nav = updatedNavigation;

    return siteDataClone;
};

/**
 * Clone siteData and add blog post template (empty page with default post header and content block)
 * @param { object } siteData - site data object (ex. current site data, template site data)
 * @param { string } isDraft - is blog post page not published yet
 * @returns cloned siteData with blog post template added
 */
export const addBlogPostTemplate = ({
    locale = SYSTEM_LOCALE,
    siteData,
    postTitle,
    postDescription,
    postContent,
    isDraft,
    isLayoutOnly,
}) => {
    addBreadcrumb({
        category: 'ADD_BLOG_POST_TEMPLATE',
        data: {
            isDraft,
        },
        level: 'debug',
        type: 'debug',
    });
    const siteDataClone = patcher.clone(siteData);
    const pageId = generateRandomId();
    const blogThumbnail = getRandomArrayItem(BLOG_PLACEHOLDERS);
    const blogHeaderBlockId = generateRandomId();
    const blogContentBlockId = generateRandomId();
    const {
        blockData: blogContentBlockData,
        elements: blogContentBlockElements,
    } = isLayoutOnly ? getBlogPostLayoutBlock(postContent, blogThumbnail) : getBlogPostGridBlock(postContent);

    let blockElementsCopy = {
        ...blogContentBlockElements,
    };

    // Handle global animations
    const itemWithGlobalAnimation = getBlocksAndElementsWithGlobalAnimations({
        blocks: siteDataClone.languages[locale].blocks,
        elements: siteDataClone.languages[locale].elements,
    });

    if (itemWithGlobalAnimation) {
        blockElementsCopy = mapAnimatableElementsWithAnimation({
            elements: blockElementsCopy,
            itemWithAnimation: itemWithGlobalAnimation,
        });
    }

    const siteDataWithBlogPostPage = addPage({
        locale,
        siteData: siteDataClone,
        pageId,
        pageData: {
            type: 'blog',
            name: postTitle,
            slug: `newBlogPost-${pageId}`,
            blocks: [
                blogHeaderBlockId,
                blogContentBlockId,
            ],
            meta: {
                title: postTitle,
                description: postDescription,
                ogImageOrigin: blogThumbnail.origin,
                ogImagePath: blogThumbnail.path,
                ogImageAlt: blogThumbnail.alt,
            },
            isDraft,
            coverImageOrigin: blogThumbnail.origin,
            coverImagePath: blogThumbnail.path,
            coverImageAlt: blogThumbnail.alt,
            // Returns the date in YYYY-MM-dd-H:m:s
            date: new Date().toISOString(),
            categories: [],
            minutesToRead: '1',
        },
        blocks: {
            [blogHeaderBlockId]: getBlogHeaderBlock(),
            [blogContentBlockId]: blogContentBlockData,
        },
        elements: {
            ...blockElementsCopy,
        },
    });

    return {
        siteDataWithBlogPostPage,
        pageId,
    };
};

export const addEcommerceProductPageTemplate = ({
    siteData,
    productData,
    locale = SYSTEM_LOCALE,
}) => {
    const siteDataClone = patcher.clone(siteData);
    const pageId = generateRandomId();
    const ecommerceProductBlockId = generateRandomId();

    const isValueNull = (value) => {
        try {
            JSON.parse(value);
        } catch {
            return false;
        }

        return true;
    };

    const truncateString = (string, length) => {
        if (string ? .length <= length) {
            return string;
        }

        const dotsLength = 3;
        const trimmedString = string.substr(0, length - dotsLength);

        // If control characters are present in string, it means string is not properly escaped
        // but this can happen if string is trimmed in the middle of unicode character (e.g. emoji).
        // Regex checks if description ends with emojis without any characters separating them and removes them

        // eslint-disable-next-line no-control-regex
        const matchedUniChar = trimmedString.match(/[^\u0000-\u00FF]+$/);
        const stringValue = matchedUniChar ? .length ? trimmedString.substr(0, matchedUniChar.index) : trimmedString;

        return `${stringValue}...`;
    };

    const descriptionHtml = new DOMParser().parseFromString(productData ? .description, 'text/html');
    const descriptionText = descriptionHtml.body.textContent;
    const parsedDescription = isValueNull(descriptionText) ? '' : descriptionText;

    const siteDataWithProductPage = addPage({
        locale,
        siteData: siteDataClone,
        pageId,
        pageData: {
            type: PAGE_TYPE_ECOMMERCE_PRODUCT,
            name: productData ? .title,
            blocks: [ecommerceProductBlockId],
            slug: `${getValidPagePath(productData?.title).path}-${pageId.toLowerCase()}`,
            productId: productData.id,
            meta: {
                description: truncateString(parsedDescription, SEO_MAX_STRING_LENGTH_DESCRIPTION),
                ogImagePath: productData ? .thumbnail,
                ogImageOrigin: 'other',
                ogImageAlt: productData ? .thumbnail ? productData ? .title : null,
            },
        },
        blocks: {
            [ecommerceProductBlockId]: getEcommerceProductBlock({
                productId: productData.id,
            }),
        },
    });

    return {
        siteDataWithProductPage,
        productId: productData.id,
    };
};

// Site data cloning
/**
 * Clone block from provided site data
 * @param { object } siteData - site data object (ex. current site data, add block template site data)
 * @param { string } blockId - id of a block in provided site data
 * @param { string } slot - optional slot value to add returned newBlock value
 * @returns object of cloned block data - newBlockId, newBlock, newElement, newBlocks
 */
export const cloneBlock = ({
    siteData,
    blockId,
    slot,
    fromLocale,
    toLocale,
}) => {
    addBreadcrumb({
        category: 'CLONE_BLOCK',
        data: {
            blockId,
            slot,
        },
        level: 'debug',
        type: 'debug',
    });

    const originalBlockClone = patcher.clone(siteData.languages[fromLocale].blocks[blockId]);
    const isBlockGridSlideshow = originalBlockClone.type === 'BlockSlideshow';

    originalBlockClone.initialBlockId = blockId;

    let newElements = {};
    const newElementsIds = [];
    const newZindexIds = originalBlockClone.zindexes ? ? [];

    // Handle block slides
    const newBlocks = {};
    const newSlides = [];

    if (isBlockGridSlideshow) {
        originalBlockClone.slides.forEach((slide) => {
            const {
                newBlockId: slideBlockId,
                newBlock: slideBlock,
                newElements: slideBlockElements,
            } = cloneBlock({
                siteData,
                blockId: slide.blockId,
                slot: null,
                fromLocale,
                toLocale,
            });

            newBlocks[slideBlockId] = slideBlock;

            newElements = {
                ...newElements,
                ...slideBlockElements,
            };

            newSlides.push({
                name: slide.name,
                initialSlideBlockId: slide.blockId,
                blockId: slideBlockId,
            });
        });
    }

    // Handle block components
    if (originalBlockClone.components) {
        originalBlockClone.components ? .forEach((elementId) => {
            const newElementId = generateRandomId();

            if (!siteData.languages[fromLocale].elements[elementId]) {
                return;
            }

            newElements[newElementId] = patcher.clone(siteData.languages[fromLocale].elements[elementId]);
            newElements[newElementId].initialElementId = elementId;

            newElementsIds.push(newElementId);
            // Keep zindex order, switch ids
            newZindexIds[newZindexIds.indexOf(elementId)] = newElementId;
        });
    }

    const newBlock = {
        ...originalBlockClone,
        ...(!isBlockGridSlideshow && {
            components: newElementsIds,
            zindexes: newZindexIds,
        }),
        ...(isBlockGridSlideshow && {
            slides: newSlides,
        }),
        ...(slot && {
            slot,
        }),
    };

    return {
        newBlockId: generateRandomId(),
        newBlock,
        newElements,
        newBlocks,
    };
};

/**
 * Clone page from provided site data
 * @param { object } siteData - site data object (ex. current site data, add block template site data)
 * @param { string } pageId - id of a block in provided site data
 * @returns object of cloned page data - clonedPageId, clonedPageData, clonedBlocks, clonedElements, clonedPageNavigationItem
 */
export const clonePage = ({
    siteData,
    pageId,
    fromLocale = SYSTEM_LOCALE,
    toLocale = SYSTEM_LOCALE,
}) => {
    addBreadcrumb({
        category: 'CLONE_PAGE',
        data: pageId,
        level: 'debug',
        type: 'debug',
    });

    const pageClone = patcher.clone(siteData.languages[fromLocale].pages[pageId]);

    const clonedPageBlocksIds = [];
    let clonedBlocks = {};
    let clonedElements = {};

    pageClone.blocks.forEach((blockId) => {
        const {
            newBlockId,
            newBlock,
            newElements,
            newBlocks,
        } = cloneBlock({
            siteData,
            blockId,
            slot: null,
            fromLocale,
            toLocale,
        });

        clonedBlocks = {
            ...clonedBlocks,
            ...newBlocks,
            [newBlockId]: newBlock,
        };

        clonedElements = {
            ...clonedElements,
            ...newElements,
        };

        clonedPageBlocksIds.push(newBlockId);
    });

    const clonedPageData = {
        ...pageClone,
        blocks: clonedPageBlocksIds,
        name: `${pageClone.name} Copy${toLocale !== fromLocale ? ` (${toLocale})` : ''}`,
        slug: getValidPagePath(`${pageClone.name}-copy-${generateRandomId()}`).path,
    };

    if (pageClone.type === PAGE_TYPE_BLOG) {
        return {
            clonedPageData,
            clonedBlocks,
            clonedElements,
            clonedPageNavigationItem: null,
        };
    }

    // Copied page can be in both root and subItem
    const navItemToCopy = siteData.languages[fromLocale].nav.find(({
            linkedPageId
        }) => linkedPageId === pageId) ||
        siteData.languages[fromLocale].nav.flatMap(({
            subItems
        }) => subItems).find(({
            linkedPageId
        }) => linkedPageId === pageId);

    const {
        navItemId,
        ...clonedPageNavigationItem
    } = navItemToCopy;

    return {
        clonedPageData,
        clonedBlocks,
        clonedElements,
        clonedPageNavigationItem,
    };
};

export const localizeHrefs = (siteData, locale) => {
    const localizedElementEntries = Object
        .entries(siteData.languages[locale].elements)
        .map((elementEntry) => {
            const [elementId, elementData] = elementEntry;
            const {
                type,
                content,
            } = elementData;

            if (type === 'GridTextBox') {
                const rehypeLocalizeHrefs = () => (tree) => {
                    visit(tree, 'element', (node) => {
                        if (node.properties.dataPageId) {
                            // eslint-disable-next-line no-param-reassign
                            node.properties.href = getPagePathFromId({
                                locale,
                                siteData,
                                pageId: node.properties.dataPageId,
                            });
                        }
                    });
                };

                const localizedContent = rehype()
                    .data('settings', REHYPE_SETTINGS)
                    .use(rehypeLocalizeHrefs)
                    .processSync(content)
                    .toString();

                return [
                    elementId,
                    {
                        ...elementData,
                        content: localizedContent,
                    },
                ];
            }

            return elementEntry;
        });

    // eslint-disable-next-line no-param-reassign
    siteData.languages[locale].elements = Object.fromEntries(localizedElementEntries);

    return siteData;
};