/* eslint-disable no-param-reassign */ // MIGRATION
import {
    generateRandomId
} from '@/utils/generateRandomId';

export default {
    namespaced: true,
    getters: {
        categoryIdByName: (state, getters, rootState, rootGetters) => (categoryName) => Object
            .entries(rootGetters.blogCategories)
            .find(([, category]) => category.name === categoryName)[0],

        categoryNameById: (state, getters, rootState, rootGetters) => (categoryId) => rootGetters
            .blogCategories[categoryId].name,

        categoriesNames: (state, getters, rootState, rootGetters) => Object.values(rootGetters.blogCategories)
            .map((value) => value.name),

        postCategoriesNames: (state, getters, rootState, rootGetters) => (postId) => rootGetters
            .sitePages[postId].categories
            .map((categoryId) => rootGetters.blogCategories[categoryId].name),
        postCategories: (state, getters, rootState, rootGetters) => (postId) => rootGetters
            .sitePages[postId].categories,

        blogListCategoriesNames: (state, getters, rootState, rootGetters) => (blockId) => rootGetters
            .siteBlocks[blockId].settings.categories
            .map((categoryId) => rootGetters.blogCategories[categoryId].name),

        isLocaleWithBlogList: (state, getters, rootState, rootGetters) => Object.values(rootGetters.siteBlocks).some((block) => block.type === 'BlockBlogList'),
        hasBlogPages: (state, getters, rootState, rootGetters) => Object.keys(rootGetters.blogPages).length > 0,
        hasBlog: (state, getters) => getters.hasBlogPages || getters.isLocaleWithBlogList,
    },
    mutations: {
        toggleBlogPostVisibility: (state, {
            rootState,
            pageId,
        }) => {
            const blogPage = rootState.website.languages[rootState.currentLocale].pages[pageId];

            blogPage.isDraft = !blogPage.isDraft;

            if (blogPage.isScheduled) {
                blogPage.isScheduled = false;
                blogPage.isDraft = false;
            }
        },

        // Categories CRUD
        addPostCategory: (state, {
            rootState,
            postId,
            categoryId,
        }) => {
            rootState.website.languages[rootState.currentLocale].pages[postId].categories.push(categoryId);
        },
        addBlogListCategory: (state, {
            rootState,
            blockId,
            categoryId,
        }) => {
            rootState.website.languages[rootState.currentLocale].blocks[blockId].settings.categories.push(categoryId);
        },
        addCategory: (state, {
            rootState,
            id = generateRandomId(),
            name,
        }) => {
            rootState.website.blogCategories[id] = {
                name,
            };
        },
        editCategory: (state, {
            rootState,
            id,
            name,
        }) => {
            rootState.website.blogCategories[id].name = name;
        },
        removeCategory: (state, {
            rootState,
            id,
        }) => {
            delete rootState.website.blogCategories[id];
        },
        setCategories: (state, {
            rootState,
            categories,
        }) => {
            rootState.website.blogCategories = categories;
        },
    },
    actions: {
        addCategory: ({
            commit,
            rootState,
        }, {
            id = generateRandomId(),
            name,
        }) => {
            commit('addCategory', {
                rootState,
                id,
                name,
            });
        },

        duplicateCategory: ({
            commit,
            rootState,
        }, {
            id = generateRandomId(),
            name,
        }) => {
            commit('addCategory', {
                rootState,
                name: `${name}-${id}`,
            });
        },

        editCategory: ({
            commit,
            getters,
            rootState,
        }, {
            oldValue,
            newValue,
        }) => {
            const id = getters.categoryIdByName(oldValue);

            commit('editCategory', {
                rootState,
                id,
                name: newValue,
            });
        },

        removeCategory: ({
            commit,
            getters,
            rootState,
            rootGetters,
            dispatch,
        }, category) => {
            // Remove category in all posts, bloglists and main categories.
            const {
                blogPages
            } = rootGetters;
            const categoryId = getters.categoryIdByName(category);

            const getEditedArray = (categoryIdsArray) => categoryIdsArray
                .filter((idToRemove) => idToRemove !== categoryId);

            // Remove in main category array
            commit('removeCategory', {
                rootState,
                id: categoryId,
            });

            //* Remove in all blog posts.
            Object.entries(blogPages).forEach(([pageId, post]) => dispatch(
                'mergePageData', {
                    pageId,
                    pageData: {
                        categories: getEditedArray(post.categories),
                    },
                }, {
                    root: true,
                },
            ));

            //* Remove in all blog lists.
            Object.entries(rootGetters.siteBlocks).forEach(([blockId, block]) => {
                if (block.type !== 'BlockBlogList') {
                    return;
                }

                dispatch(
                    'updateBlockData', {
                        blockId,
                        blockData: {
                            settings: {
                                categories: getEditedArray(block.settings.categories),
                            },
                        },
                        merge: true,
                    }, {
                        root: true,
                    },
                );
            });
        },

        addPostCategory: ({
            commit,
            dispatch,
            rootState,
        }, {
            categoryId = generateRandomId(),
            postId,
            name,
        }, ) => {
            dispatch('addCategory', {
                id: categoryId,
                name,
            });
            commit('addPostCategory', {
                rootState,
                postId,
                categoryId,
            });
        },

        addBlogListCategory: ({
            commit,
            dispatch,
            rootState,
        }, {
            categoryId = generateRandomId(),
            blockId,
            name,
        }, ) => {
            dispatch('addCategory', {
                id: categoryId,
                name,
            });
            commit('addBlogListCategory', {
                rootState,
                blockId,
                categoryId,
            });
        },

        setCategories: ({
            commit,
            rootState,
        }, {
            categories
        }) => {
            commit('setCategories', {
                rootState,
                categories,
            });
        },

        toggleBlogPostVisibility: ({
            commit,
            rootState,
        }, pageId) => {
            commit('toggleBlogPostVisibility', {
                rootState,
                pageId,
            });
        },
        // Based on how Medium calculates read time.
        // wordReadDuration - 1 word takes to read 0.22s for an average person.
        // imageBaseDuration - 1st image takes 12 seconds, 2nd - 11 seconds, ..., 10th image - 3 seconds.
        // The rest of the images take also 3 seconds.
        calculateReadTime: ({
            dispatch,
            rootGetters,
        }, {
            pageId
        }) => {
            // Collect all components that are inside the blog post.
            const pageBlocksIds = rootGetters.sitePages[pageId].blocks;
            const excludedBlockTypes = ['BlockBlogHeader'];

            const filteredPageBlockIds = pageBlocksIds
                .filter((blockId) => !excludedBlockTypes.includes(rootGetters.siteBlocks[blockId].type));
            const filteredComponentIds = filteredPageBlockIds
                .flatMap((blockId) => rootGetters.siteBlocks[blockId].components);

            const minImageReadTime = 3;
            const wordReadTime = 0.22;
            let imageReadTime = 12;
            let readTime = 0;

            filteredComponentIds.forEach((componentId) => {
                // Clean up TextBox content from HTML, count amount of words and get read time.
                const component = rootGetters.siteElements[componentId];

                if (component.type === 'GridTextBox') {
                    const cleanContent = component.content.replace(/<\/?[^>]+(>|$)/g, ' ');
                    const wordsCount = cleanContent.match(/\b[\w()+?-]+\b/gi) ? .length;

                    readTime += wordsCount ? wordsCount * wordReadTime : 0;
                }

                // Add imageReadTime for each image. After each image addition, lower the reading time by 1.
                // When the imageReadTime reaches min reading time, stop reducing and use the min value.
                if (component.type === 'GridImage') {
                    readTime += imageReadTime === minImageReadTime ? minImageReadTime : imageReadTime;
                    imageReadTime = imageReadTime === minImageReadTime ? minImageReadTime : imageReadTime - 1;
                }
            });
            // Normalize the read time. If it is less than 60 seconds, treat like 1 minute.
            // Else, just convert seconds into minutes and use that number as the final value.
            const readTimeInMinutes = readTime / 60;
            const normalizedReadTime = readTimeInMinutes < 1 ? 1 : Math.round(readTimeInMinutes);

            dispatch('mergePageData', {
                pageId,
                pageData: {
                    minutesToRead: `${normalizedReadTime}`,
                },
            }, {
                root: true,
            });
        },
    },
};