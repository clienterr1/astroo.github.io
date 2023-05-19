import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    getCode,
    CODE,
} from '@zyro-inc/site-modules/utils/getCode';
import {
    useBaseActionList,
    categoryNames,
} from '@/components/spotlight/actionsList';
import {
    PAGE_TYPE_DEFAULT,
    PAGE_TYPE_BLOG,
} from '@zyro-inc/site-modules/constants';
import EventLogApi from '@/api/EventLogApi';

const isSearchOpen = ref(false);
const searchKeyword = ref('');
const selectedAction = ref(null);
const searchResults = ref({});
const pageTypeToFilter = ref(null);
const isPageListShown = ref(false);
const selectedPageId = ref(null);
const searchPagesToShow = ref([]);

const pageTypeName = computed(() => (pageTypeToFilter.value === PAGE_TYPE_BLOG ? 'common.blogPost' : 'common.pages'));
const searchInputPlaceholder = computed(() => {
    if (!isPageListShown.value) {
        return 'common.searchCommands';
    }

    return pageTypeToFilter.value === PAGE_TYPE_BLOG ? 'common.searchForPages' : 'common.searchForPages';
});
const hasResults = computed(() => Object.values(searchResults.value).length > 0);
const selectedActionId = computed(() => selectedAction.value ? .id);
const actionListArray = computed(() => Object.values(searchResults.value).flat());
const selectedActionIndex = computed(() => (actionListArray.value.findIndex((action) => action.id === selectedActionId.value) ? ? 0));

export const openPageList = (pageType = null) => {
    pageTypeToFilter.value = pageType;
    isPageListShown.value = true;
    selectedAction.value = null;
    searchKeyword.value = '';
};

export const showDefaultPageList = () => openPageList(PAGE_TYPE_DEFAULT);

export const showBlogPostPageList = () => openPageList(PAGE_TYPE_BLOG);

export const closePageList = () => {
    pageTypeToFilter.value = null;
    isPageListShown.value = false;
    selectedPageId.value = null;
};

const closeSearch = () => {
    closePageList();
    searchKeyword.value = '';
    selectedAction.value = null;
    isSearchOpen.value = false;
};

const toggleSearch = () => {
    closePageList();
    searchKeyword.value = '';
    selectedAction.value = null;
    isSearchOpen.value = !isSearchOpen.value;
};

const getNextActionIndex = (currentIndex = 0, list = []) => (currentIndex - 1 < 0 ? list.length - 1 : currentIndex - 1);
const getPreviousActionIndex = (currentIndex = 0, list = []) => (currentIndex + 1 > list.length - 1 ? 0 : currentIndex + 1);

const doSelectedAction = (selectedOption) => {
    const {
        action,
        shouldKeepSpotlightOpen,
    } = selectedOption;

    if (!action) {
        return;
    }

    action();

    if (!shouldKeepSpotlightOpen) {
        closeSearch();
    }
};

export const useSpotlight = () => {
    const {
        dispatch,
        getters,
    } = useStore();

    const {
        baseActionList
    } = useBaseActionList();

    const openSelectedPage = (pageId) => {
        dispatch('updateCurrentPageId', pageId);
        closeSearch();
    };

    const openSearch = () => {
        EventLogApi.logEvent({
            eventName: 'website_builder.search.enter',
            isHostingerEvent: true,
        });

        isSearchOpen.value = true;
        dispatch('unselectCurrentElement');
    };

    const pagesByCategory = computed(() => {
        if (pageTypeToFilter.value === PAGE_TYPE_DEFAULT) {
            return getters.defaultPages;
        }

        if (pageTypeToFilter.value === PAGE_TYPE_BLOG) {
            return getters.blogPages;
        }

        return getters.sitePages;
    });

    const onKeyDownPressed = (event) => {
        // esc - close search
        if (getCode(event) === CODE.Escape && isSearchOpen.value) {
            closeSearch();
        }

        // CMD/ CTRL + Slash on NumLock or slash without shift - open search
        if ((event.ctrlKey || event.metaKey) &&
            (getCode(event) === CODE.NumLockSlash || (getCode(event) === CODE.KeySlash && !event.shiftKey))) {
            event.preventDefault();
            dispatch('unselectCurrentElement');
            toggleSearch();
        }

        // enter - do selected action / open selected page
        if (getCode(event) === CODE.Enter && isSearchOpen.value) {
            if (selectedActionId.value && !isPageListShown.value) {
                doSelectedAction(selectedAction.value);

                return;
            }

            if (selectedPageId.value && isPageListShown.value) {
                openSelectedPage(selectedPageId.value);

                return;
            }

            return;
        }

        // arrow up - select previous action
        if (getCode(event) === CODE.ArrowUp && isSearchOpen.value) {
            event.preventDefault();

            // Selecting next page in page list
            if (isPageListShown.value) {
                const pageIdList = Object.keys(searchPagesToShow.value);
                const selectedPageIndex = pageIdList.findIndex((pageId) => pageId === selectedPageId.value) ? ? 0;

                const newIndex = getNextActionIndex(selectedPageIndex, pageIdList);

                const newPageId = pageIdList[newIndex];

                if (newPageId) {
                    selectedPageId.value = newPageId;
                }

                return;
            }

            // Selecting next action in search results
            const newIndex = getNextActionIndex(selectedActionIndex.value, actionListArray.value);

            const previousAction = actionListArray.value[newIndex];

            if (previousAction) {
                selectedAction.value = previousAction;
            }
        }

        // arrow down - select next action
        if (getCode(event) === CODE.ArrowDown && isSearchOpen.value) {
            event.preventDefault();

            // Selecting previous page in page list
            if (isPageListShown.value) {
                const pageIdList = Object.keys(searchPagesToShow.value);
                const selectedPageIndex = pageIdList.findIndex((pageId) => pageId === selectedPageId.value) ? ? 0;

                const newIndex = getPreviousActionIndex(selectedPageIndex, pageIdList);
                const newPageId = pageIdList[newIndex];

                if (newPageId) {
                    selectedPageId.value = newPageId;
                }

                return;
            }

            // Selecting previous action in search results
            const newIndex = getPreviousActionIndex(selectedActionIndex.value, actionListArray.value);

            const previousAction = actionListArray.value[newIndex];

            if (previousAction) {
                selectedAction.value = previousAction;
            }
        }

        // CMD/ CTRL + Backspace - close page list
        if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.Backspace && isSearchOpen.value && isPageListShown.value) {
            event.preventDefault();
            closePageList();
        }
    };

    const setSearchResults = () => {
        searchPagesToShow.value = pagesByCategory.value;

        if (isPageListShown.value) {
            searchPagesToShow.value = Object.fromEntries(Object.entries(pagesByCategory.value).filter(
                ([, pageData]) => pageData.name.toLowerCase().includes(searchKeyword.value.toLowerCase()),
            ));

            const hasPageResults = Object.keys(searchPagesToShow.value).length > 0;

            // If there are no results, clear selected page
            if (!hasPageResults) {
                selectedPageId.value = null;
            }

            // If there are results, select first page ID
            if (hasPageResults) {
                [selectedPageId.value] = Object.keys(searchPagesToShow.value);
            }

            return;
        }

        // List actions by category and filter them by search keyword and hidden status
        const categoriesWithFilteredActions = Object.keys(categoryNames).map((category) => [
            category,
            baseActionList.value.filter((action) => action.category === category &&
                !action.isHidden && action.searchKeywords.includes(searchKeyword.value)),
        ]);

        // Remove categories with no actions
        searchResults.value = Object.fromEntries(categoriesWithFilteredActions.filter(([, actions]) => actions.length > 0));

        // If there are no results, clear selected action
        if (!hasResults.value) {
            selectedAction.value = null;
        }

        // If there are results, select first category first action
        if (hasResults.value) {
            [selectedAction.value] = searchResults.value[Object.keys(searchResults.value)[0]];
        }
    };

    return {
        hasResults,
        openSearch,
        closeSearch,
        pageTypeName,
        toggleSearch,
        isSearchOpen,
        closePageList,
        searchKeyword,
        searchResults,
        selectedPageId,
        isPageListShown,
        pageTypeToFilter,
        setSearchResults,
        selectedActionId,
        onKeyDownPressed,
        doSelectedAction,
        openSelectedPage,
        searchPagesToShow,
        searchInputPlaceholder,
    };
};