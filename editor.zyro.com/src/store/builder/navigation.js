/* eslint-disable no-param-reassign */ // MIGRATION
import {
    NAVIGATION_GROUP_ROOT,
    NAVIGATION_GROUP_HIDDEN,
} from '@/constants';
import {
    generateRandomId
} from '@/utils/generateRandomId';

const NAVIGATION_GROUPS = [
    NAVIGATION_GROUP_ROOT,
    NAVIGATION_GROUP_HIDDEN,
];

export default {
    namespaced: true,
    getters: {
        navItems: (state, getters, rootState, {
            currentLanguageData
        }) => currentLanguageData.nav ? ? [],
        hiddenItems: (state, {
            navItems
        }) => navItems.filter(({
            isHidden
        }) => isHidden) ? ? [],
        visibleItems: (state, {
            navItems
        }) => navItems.filter(({
            isHidden
        }) => !isHidden) ? ? [],
        isNavigationHidden: (state, getters, rootState, {
            currentLanguageData
        }) => currentLanguageData.isNavHidden ? ? false,
        getIsItemInRoot: (state, {
            navItems
        }) => (navItemId) => navItems.some((item) => item.navItemId === navItemId),
        getSubItemById: (state, {
            navItems
        }) => (navItemId) => navItems.flatMap(
            (item) => item.subItems,
        ).find((item) => item ? .navItemId === navItemId),
        getSubItemByPageId: (state, {
            navItems
        }) => (pageId) => navItems.flatMap(
            (item) => item.subItems,
        ).find((item) => item ? .linkedPageId === pageId),
        getItemById: (state, {
            navItems,
            getSubItemById,
        }) => (itemId) => navItems.find(({
            navItemId
        }) => navItemId === itemId) || getSubItemById(itemId),
        getItemIndexById: (state, {
            navItems
        }) => (itemId) => navItems.findIndex(({
            navItemId
        }) => navItemId === itemId),
        getItemByPageId: (state, {
            navItems,
            getSubItemByPageId,
        }) => (pageId) => navItems.find(({
            linkedPageId
        }) => linkedPageId === pageId) || getSubItemByPageId(pageId),
    },
    mutations: {
        // Navigation
        setIsNavigationHidden: (state, {
            rootState,
            isHidden,
        }) => {
            const languageData = rootState.website.languages[rootState.currentLocale];

            languageData.isNavHidden = isHidden;
        },
        // Navigation items
        setItemPosition: (state, {
            rootState,
            oldIndex,
            newIndex,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];
            const item = nav[oldIndex];

            if (newIndex < 0) {
                nav.splice(oldIndex, 1);
                nav.push(item);

                return;
            }

            nav.splice(oldIndex, 1);
            nav.splice(newIndex, 0, item);
        },
        addVisibleItem: (state, {
            rootState,
            item,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            nav.push(item);
        },
        addHiddenItem: (state, {
            rootState,
            item,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            nav.push({
                ...item,
                isHidden: true,
            });
        },
        setItemData: (state, {
            rootState,
            itemIndex,
            data,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            const updatedItem = {
                ...nav[itemIndex],
                ...data,
            };

            nav.splice(itemIndex, 1);
            nav.splice(itemIndex, 0, updatedItem);
        },
        setSubItemData: (state, {
            rootState,
            itemIndex,
            subItemIndex,
            data,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            const updatedSubItem = {
                ...nav[itemIndex].subItems[subItemIndex],
                ...data,
            };

            const updatedSubItemsList = [...nav[itemIndex].subItems];

            updatedSubItemsList.splice(subItemIndex, 1);
            updatedSubItemsList.splice(subItemIndex, 0, updatedSubItem);

            const updatedItem = {
                ...nav[itemIndex],
                subItems: updatedSubItemsList,
            };

            nav.splice(itemIndex, 1);
            nav.splice(itemIndex, 0, updatedItem);
        },
        removeItem: (state, {
            rootState,
            itemIndex,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            nav.splice(itemIndex, 1);
        },
        removeSubItem: (state, {
            rootState,
            itemIndex,
            subItemIndex,
        }) => {
            const {
                nav
            } = rootState.website.languages[rootState.currentLocale];

            const updatedSubItemsList = [...nav[itemIndex].subItems];

            updatedSubItemsList.splice(subItemIndex, 1);

            const updatedItem = {
                ...nav[itemIndex],
                subItems: updatedSubItemsList,
            };

            nav.splice(itemIndex, 1);
            nav.splice(itemIndex, 0, updatedItem);
        },
    },
    actions: {
        updateNavigationVisibility: ({
            getters,
            commit,
            rootState,
            rootGetters,
        }) => {
            const isLanguageSwitcherVisible = !!rootGetters.siteLanguagesArray.length;
            const isHidden = getters.visibleItems.length === 0 && !isLanguageSwitcherVisible;

            commit('setIsNavigationHidden', {
                rootState,
                isHidden,
            });
        },
        addItem: ({
            commit,
            dispatch,
            rootState,
        }, {
            itemId = generateRandomId(),
            item,
            isHidden = false,
        }, ) => {
            if (isHidden) {
                commit('addHiddenItem', {
                    rootState,
                    item: {
                        ...item,
                        navItemId: itemId,
                    },
                });
            } else {
                commit('addVisibleItem', {
                    rootState,
                    item: {
                        ...item,
                        navItemId: itemId,
                    },
                });
            }

            dispatch('updateNavigationVisibility');
        },
        setItemData: ({
            commit,
            rootState,
            getters,
        }, {
            data
        }, ) => {
            // if item is not in root, update subItem data
            if (!getters.getIsItemInRoot(data.navItemId)) {
                const itemIndex = getters.navItems.findIndex(({
                    subItems
                }) => subItems ? .some(
                    ({
                        navItemId
                    }) => navItemId === data.navItemId,
                ));

                const subItemIndex = getters.navItems[itemIndex].subItems.findIndex(
                    ({
                        navItemId
                    }) => navItemId === data.navItemId,
                );

                if (subItemIndex === -1) {
                    return;
                }

                commit('setSubItemData', {
                    rootState,
                    itemIndex,
                    subItemIndex,
                    data,
                });

                return;
            }

            const itemIndex = getters.getItemIndexById(data.navItemId);

            if (itemIndex === -1) {
                return;
            }

            commit('setItemData', {
                rootState,
                itemIndex,
                data,
            });
        },
        duplicateItem: ({
            dispatch,
            getters,
        }, {
            itemId
        }) => {
            const itemToDuplicate = getters.getItemById(itemId);

            dispatch('addItem', {
                item: {
                    ...itemToDuplicate,
                    name: `${itemToDuplicate.name} Copy`,
                },
                isHidden: itemToDuplicate.isHidden ? ? false,
            });
        },
        removeItem: ({
            dispatch,
            commit,
            rootState,
            getters,
        }, {
            itemId
        }) => {
            // if item is not in root, remove subItem
            if (!getters.getIsItemInRoot(itemId)) {
                const itemIndex = getters.navItems.findIndex(({
                    subItems
                }) => subItems.some(
                    ({
                        navItemId
                    }) => navItemId === itemId,
                ));

                const subItemIndex = getters.navItems[itemIndex].subItems.findIndex(
                    ({
                        navItemId
                    }) => navItemId === itemId,
                );

                commit('removeSubItem', {
                    rootState,
                    itemIndex,
                    subItemIndex,
                });

                return;
            }

            // Remove parent item
            const item = getters.getItemById(itemId);
            const itemIndex = getters.getItemIndexById(itemId);

            const {
                subItems = [],
                    isHidden,
            } = item;

            commit('removeItem', {
                rootState,
                itemIndex,
            });

            // Move subItems to ROOT group, if item has them
            if (subItems.length > 0) {
                subItems.forEach((subItem) => {
                    dispatch('addItem', {
                        itemId: subItem.navItemId,
                        item: subItem,
                        isHidden,
                    });
                });

                return;
            }

            dispatch('updateNavigationVisibility');
        },
        changeItemVisibility: ({
            getters,
            dispatch,
        }, {
            isHidden,
            itemId,
        }) => {
            if (!getters.getIsItemInRoot(itemId)) {
                const parentItem = getters.navItems.find(({
                    subItems
                }) => subItems.some(
                    ({
                        navItemId
                    }) => navItemId === itemId,
                ));

                const oldIndex = parentItem.subItems.findIndex(
                    ({
                        navItemId
                    }) => navItemId === itemId,
                );

                dispatch('moveItem', {
                    fromId: parentItem.navItemId,
                    toId: isHidden ? NAVIGATION_GROUP_HIDDEN : NAVIGATION_GROUP_ROOT,
                    oldIndex,
                    newIndex: 0,
                });

                return;
            }

            const fromId = isHidden ? NAVIGATION_GROUP_ROOT : NAVIGATION_GROUP_HIDDEN;
            const oldIndex = isHidden ? getters.visibleItems.findIndex(({
                    navItemId
                }) => navItemId === itemId) :
                getters.hiddenItems.findIndex(({
                    navItemId
                }) => navItemId === itemId);

            dispatch('moveItem', {
                fromId,
                toId: isHidden ? NAVIGATION_GROUP_HIDDEN : NAVIGATION_GROUP_ROOT,
                oldIndex,
                newIndex: 0,
            });
        },
        moveItem: ({
            dispatch,
            getters,
        }, {
            fromId,
            toId,
            oldIndex,
            newIndex,
        }) => {
            const {
                getItemById
            } = getters;

            // Item handling, when moving from root navigation groups
            if (NAVIGATION_GROUPS.includes(fromId)) {
                const itemToMove = fromId === NAVIGATION_GROUP_HIDDEN ? getters.hiddenItems[oldIndex] : getters.visibleItems[oldIndex];

                // Item handling, when moving from root navigation to same or different root navigation group
                if (NAVIGATION_GROUPS.includes(toId)) {
                    const isHidden = toId === NAVIGATION_GROUP_HIDDEN;

                    const subItems = itemToMove ? .subItems ? .map((subItem) => ({
                        ...subItem,
                        isHidden,
                    })) ? ? [];

                    const updatedItem = {
                        ...itemToMove,
                        isHidden,
                        subItems,
                    };

                    dispatch('setItemData', {
                        data: updatedItem,
                    });

                    dispatch('moveItemInRoot', {
                        toId,
                        itemToMove: updatedItem,
                        newIndex,
                    });

                    return;
                }

                // Item handling, when moving to drop-down from navigation root
                dispatch('removeItem', {
                    itemId: itemToMove.navItemId,
                });

                dispatch('moveItemInDropDown', {
                    toId,
                    itemToMove,
                    newIndex,
                });

                return;
            }

            // Item handling, when moving from drop-down
            const rootItem = getItemById(fromId);

            const [itemToMove] = rootItem.subItems.splice(oldIndex, 1);

            // Removing item from drop-down that it was moved from:
            dispatch('setItemData', {
                data: {
                    ...rootItem,
                },
            });

            // Item handling, when moving from drop-down to root navigation groups
            if (NAVIGATION_GROUPS.includes(toId)) {
                const updatedItem = {
                    ...itemToMove,
                    isHidden: toId === NAVIGATION_GROUP_HIDDEN,
                };

                dispatch('addItem', {
                    itemId: updatedItem.navItemId,
                    item: updatedItem,
                });

                dispatch('moveItemInRoot', {
                    toId,
                    itemToMove: updatedItem,
                    newIndex,
                });

                return;
            }

            // Item handling, when moving from drop-down to different drop-down
            dispatch('moveItemInDropDown', {
                toId,
                itemToMove,
                newIndex,
            });
        },
        moveItemInRoot: ({
            dispatch,
            getters,
            commit,
            rootState,
        }, {
            toId,
            itemToMove,
            newIndex,
        }) => {
            const {
                getItemIndexById
            } = getters;

            const itemToMoveTo = toId === NAVIGATION_GROUP_HIDDEN ? getters.hiddenItems[newIndex] : getters.visibleItems[newIndex];
            const itemIndex = getItemIndexById(itemToMove.navItemId);
            const itemToMoveToIndex = itemToMoveTo ? getItemIndexById(itemToMoveTo.navItemId) : 0;

            if (newIndex !== undefined && itemIndex !== itemToMoveToIndex) {
                commit('setItemPosition', {
                    rootState,
                    oldIndex: itemIndex,
                    newIndex: itemToMoveToIndex,
                });
            }

            dispatch('updateNavigationVisibility');
        },
        moveItemInDropDown: ({
            dispatch,
            getters,
        }, {
            toId,
            itemToMove,
            newIndex,
        }) => {
            const itemToAddSubItem = getters.getItemById(toId);

            const {
                subItems = []
            } = itemToAddSubItem;
            const itemWithUpdatedVisibility = {
                ...itemToMove,
                isHidden: itemToAddSubItem.isHidden,
            };

            if (newIndex !== -1) {
                subItems.splice(newIndex, 0, itemWithUpdatedVisibility);
            } else {
                subItems.push(itemWithUpdatedVisibility);
            }

            dispatch('setItemData', {
                data: {
                    ...itemToAddSubItem,
                    subItems,
                },
            });

            dispatch('updateNavigationVisibility');
        },
    },
};