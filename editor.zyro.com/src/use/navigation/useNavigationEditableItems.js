import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    NAVIGATION_TYPE_PAGE,
    NAVIGATION_ICONS,
    NAVIGATION_TYPE_LINK,
    NAVIGATION_TYPE_HOMEPAGE,
    NAVIGATION_TYPE_FOLDER,
} from '@/constants';

const allowedMovableTypes = [
    NAVIGATION_TYPE_LINK,
    NAVIGATION_TYPE_PAGE,
];

export const useNavigationEditableItems = () => {
    const {
        state,
        getters,
        dispatch,
    } = useStore();

    const defaultPages = computed(() => getters.defaultPages);
    const homepageId = computed(() => getters.homePageId);
    const currentPageId = computed(() => state.currentPageId);

    const navItems = computed(() => getters['navigation/navItems']);
    const visibleItems = computed(() => getters['navigation/visibleItems']);
    const hiddenItems = computed(() => getters['navigation/hiddenItems']);

    const getItemData = ({
        navItem,
        parentId,
        groupItems,
    }) => {
        const {
            navItemId,
            linkType,
            linkedPageId,
            name,
            subItems = [],
            isHidden,
        } = navItem;

        const indexInVisibleList = visibleItems.value.findIndex((item) => item.navItemId === navItemId);
        const indexInHiddenList = hiddenItems.value.findIndex((item) => item.navItemId === navItemId);
        const indexInGroup = parentId && groupItems.findIndex((item) => item.navItemId === navItemId);

        const visibleListIndex = indexInVisibleList === -1 ? null : indexInVisibleList;
        const hiddenListIndex = indexInHiddenList === -1 ? null : indexInHiddenList;

        const itemIndex = indexInGroup || visibleListIndex || hiddenListIndex;
        const isHomepage = homepageId.value === linkedPageId;

        const {
            icon
        } = NAVIGATION_ICONS[isHomepage ? NAVIGATION_TYPE_HOMEPAGE : linkType];

        const pageName = linkedPageId ? defaultPages.value[linkedPageId].name : name;
        const isPageWithPassword = defaultPages.value[linkedPageId] ? .meta ? .password ? ? false;

        const canBeDraggedToItemAbove = () => {
            const isMovableRootItem = indexInVisibleList && indexInVisibleList !== 0 && indexInVisibleList !== -1;

            if (!isMovableRootItem || !allowedMovableTypes.includes(linkType)) {
                return {
                    canBeMovedToDropdown: false,
                    itemAboveId: null,
                };
            }

            const itemAbove = visibleItems.value[indexInVisibleList - 1];

            return {
                canBeMovedToDropdown: subItems.length === 0,
                itemAboveId: itemAbove.navItemId,
            };
        };

        const {
            canBeMovedToDropdown,
            itemAboveId,
        } = canBeDraggedToItemAbove();

        return {
            // Attributes for EditableItemsList
            navItemId,
            icon,
            isCurrent: currentPageId.value === linkedPageId,
            linkedPageId,
            vQa: `sitemenu-page-${pageName}`,
            subItems: subItems.map((subItem) => getItemData({
                navItem: subItem,
                parentId: navItemId,
                groupItems: subItems,
            })),
            // Once we want to have move than one level drop-down, remove parentId check.
            hasSubList: (subItems.length || !isHidden) && !parentId,
            // Attributes for item popup
            linkType,
            isHidden,
            isHomepage,
            isRootItem: !parentId,
            index: itemIndex,
            parentIndex: parentId && navItems.value.findIndex((item) => item.navItemId === parentId),
            groupId: parentId,
            itemAboveId,
            canBeMovedToDropdown,
            name: pageName,
            isWithPassword: isPageWithPassword,
            isItemPlaceholderShown: linkType === NAVIGATION_TYPE_FOLDER && !isHidden,
        };
    };

    const rootEditableItems = computed(() => visibleItems.value.map((navItem) => getItemData({
        navItem,
    })));

    const hiddenEditableItems = computed(() => hiddenItems.value.map((navItem) => getItemData({
        navItem,
    })));

    const handleItemsSort = ({
        fromId,
        toId,
        oldIndex,
        newIndex,
    }) => {
        dispatch('navigation/moveItem', {
            fromId,
            toId,
            oldIndex,
            newIndex,
        });
    };

    return {
        rootEditableItems,
        hiddenEditableItems,
        handleItemsSort,
    };
};