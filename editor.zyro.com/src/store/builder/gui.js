import cloneDeep from 'lodash.clonedeep';
import {
    createNamespacedHelpers
} from 'vuex';

import {
    MEDIA_MOBILE_BREAKPOINT
} from '@zyro-inc/site-modules/constants';

import EventLogApi from '@/api/EventLogApi';
import {
    DRAWER_PAGES,
    DRAWER_PAGES_DEFAULT_STATE,
    USER_STYLES_MAIN_PAGE_KEY,

    DRAWER_USER_STYLES,
    DRAWER_BLOG,
    DRAWER_ADD_ELEMENT,
    DRAWER_MULTI_PAGE,
    DRAWER_MULTILINGUAL,
} from '@/constants';

// namespacing to use with `createNamespacedHelpers`
export const GUI_NAMESPACE = 'gui';

// action type constants:
export const UPDATE_IS_MOBILE_SCREEN = 'UPDATE_IS_MOBILE_SCREEN';
export const UPDATE_HEADER_HEIGHT = 'UPDATE_HEADER_HEIGHT';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const OPEN_SIDEBAR = 'OPEN_SIDEBAR';
export const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const OPEN_HEATMAP = 'OPEN_HEATMAP';
export const CLOSE_HEATMAP = 'CLOSE_HEATMAP';
export const TOGGLE_HEATMAP = 'TOGGLE_HEATMAP';
export const CHANGE_DRAWER_PAGE = 'CHANGE_DRAWER_PAGE';
export const CHANGE_DRAWER_OPTIONS = 'CHANGE_DRAWER_OPTIONS';
export const CHANGE_PREVIOUS_DRAWER_PAGE = 'CHANGE_PREVIOUS_DRAWER_PAGE';

// mutation type constants:
export const SET_IS_MOBILE_SCREEN = 'SET_IS_MOBILE_SCREEN';
export const SET_ACTIVE_MODAL = 'SET_ACTIVE_MODAL';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const SET_COLLAPSIBLE_SIDEBAR = 'SET_COLLAPSIBLE_SIDEBAR';
export const SET_ACTIVE_DRAWER = 'SET_ACTIVE_DRAWER';
export const SET_HEATMAP_OPEN = 'SET_HEATMAP_OPEN';
export const SET_HEADER_HEIGHT = 'SET_HEADER_HEIGHT';
export const SET_DRAWER_PAGE = 'SET_DRAWER_PAGE';
export const SET_BLOCK_RESIZE_INFO = 'SET_BLOCK_RESIZE_INFO';
export const SET_COLOR_PICKER_OPEN = 'SET_COLOR_PICKER_OPEN';

/**
 * TODO: each namespacedHelper export should go to corresponding module state/action/mutation files
 *
 * Considering it's our own pattern, we should document this after refactoring. Smth. like:
 * 'Exported namespaced state/getters/actions/mutations map. Import it together with constants.'
 */
export const {
    mapState: mapStateGui
} = createNamespacedHelpers(GUI_NAMESPACE);
export const {
    mapActions: mapActionsGui
} = createNamespacedHelpers(GUI_NAMESPACE);
export const {
    mapMutations: mapMutationsGui
} = createNamespacedHelpers(GUI_NAMESPACE);

export default {
    namespaced: true,
    state: {
        isMobileView: false,
        isTabletView: false,
        isMobileScreen: window.innerWidth < MEDIA_MOBILE_BREAKPOINT,
        isSidebarOpen: true,
        isSidebarExpanded: false,
        activeModalName: null,
        activeModalSettings: {},
        activeDrawer: null,
        activeDrawerSettings: {},
        mobilePreviewRef: null,
        desktopPreviewRef: null,
        isSiteBeingPublished: false,
        isSiteBeingUpdated: false,
        headerHeight: null,
        isHeatmapOpen: false,
        drawerPage: DRAWER_PAGES_DEFAULT_STATE,
        blockResizeInfo: {},
        isColorPickerOpen: false,
        isMigrationToLayoutPopupVisible: false,
        isMigrationToLayoutModalVisible: true,
    },
    getters: {
        isMobileMode: (state) => state.isMobileScreen || state.isMobileView,
        mobilePreviewRef: (state) => state.mobilePreviewRef,
        isColorPickerOpen: (state) => state.isColorPickerOpen,
        isMigrationToLayoutModalVisible: (state) => state.isMigrationToLayoutModalVisible,
    },
    mutations: {
        setMigrationToLayoutPopupVisibility: (state, value) => {
            state.isMigrationToLayoutPopupVisible = value;
        },
        setMigrationToLayoutModalVisibility: (state, value) => {
            state.isMigrationToLayoutModalVisible = value;
        },
        toggleMobileView: (state) => {
            state.isMobileView = !state.isMobileView;
            state.isTabletView = false;
        },
        toggleTabletView: (state) => {
            state.isTabletView = !state.isTabletView;
            state.isMobileView = false;
        },
        toggleDesktopView: (state) => {
            state.isTabletView = false;
            state.isMobileView = false;
        },
        toggleSiteBeingPublished: (state) => {
            state.isSiteBeingPublished = !state.isSiteBeingPublished;
        },
        setIsSiteBeingUpdated: (state, value) => {
            state.isSiteBeingUpdated = value;
        },
        setRef: (state, {
            el,
            ref,
        }) => {
            state[el] = ref;
        },
        [SET_HEADER_HEIGHT]: (state, height) => {
            state.headerHeight = height;
        },
        [SET_ACTIVE_MODAL]: (state, {
            name,
            settings,
        }) => {
            state.activeModalName = name;
            state.activeModalSettings = settings;
        },
        [SET_SIDEBAR_OPEN]: (state, isOpenState) => {
            state.isSidebarOpen = isOpenState;
        },
        [SET_COLLAPSIBLE_SIDEBAR]: (state, isSidebarExpanded) => {
            state.isSidebarExpanded = isSidebarExpanded;
        },
        [SET_HEATMAP_OPEN]: (state, isOpenState) => {
            state.isHeatmapOpen = isOpenState;
        },
        [SET_ACTIVE_DRAWER]: (state, {
            id,
            settings,
        }) => {
            state.activeDrawer = id;
            state.activeDrawerSettings = settings;
        },
        [SET_IS_MOBILE_SCREEN]: (state, isMobileScreen) => {
            state.isMobileScreen = isMobileScreen;
        },
        [SET_DRAWER_PAGE]: (state, {
            drawerPage,
            drawerKey,
        }) => {
            state.drawerPage[drawerKey] = drawerPage;
        },
        [SET_BLOCK_RESIZE_INFO]: (state, blockResizeInfo) => {
            state.blockResizeInfo = blockResizeInfo;
        },
        [SET_COLOR_PICKER_OPEN]: (state, value) => {
            state.isColorPickerOpen = value;
        },
    },
    actions: {
        setRef({
            commit
        }, {
            element,
            ref,
        }) {
            commit('setRef', {
                el: element,
                ref,
            });
        },
        setMigrationToLayoutPopupVisibility({
            commit
        }, value) {
            commit('setMigrationToLayoutPopupVisibility', value);
        },
        setMigrationToLayoutModalVisibility({
            commit
        }, value) {
            commit('setMigrationToLayoutModalVisibility', value);
        },
        setAnimationsIntroductionModalVisibility({
            commit
        }, value) {
            commit('setAnimationsIntroductionModalVisibility', value);
        },
        setIsSiteBeingUpdated({
            commit
        }, value) {
            commit('setIsSiteBeingUpdated', value);
        },
        toggleMobileView: async ({
            dispatch,
            commit,
        }) => {
            // If leaveElementEditMode is not executed before toggling mobile view, text editor breaks (root cause unclear yet)
            await dispatch('leaveElementEditMode', {
                saveToHistory: false,
            }, {
                root: true,
            });
            commit('toggleMobileView');
        },

        [UPDATE_HEADER_HEIGHT]: ({
            state,
            commit,
        }, height) => {
            if (!state.headerHeight && height) {
                commit(SET_HEADER_HEIGHT, height);
            }
        },

        // TODO: Test these three actions for @matasmazeikaa. Dunno how to test these properly
        [CHANGE_DRAWER_PAGE]: ({
            commit
        }, {
            drawerKey,
            pageKey,
            options = {},
        }) => {
            const drawerPageData = DRAWER_PAGES[drawerKey][pageKey];
            const drawerPage = {
                ...drawerPageData,
                options: {
                    ...drawerPageData.options,
                    ...options,
                },
            };

            commit(SET_DRAWER_PAGE, {
                drawerKey,
                drawerPage,
            });
        },

        [CHANGE_DRAWER_OPTIONS]: ({
            commit,
            state,
        }, {
            drawerKey,
            options = {},
        }) => {
            const drawerPageData = state.drawerPage[drawerKey];
            const drawerPage = {
                ...drawerPageData,
                options: {
                    ...drawerPageData.options,
                    ...options,
                },
            };

            commit(SET_DRAWER_PAGE, {
                drawerKey,
                drawerPage,
            });
        },

        [CHANGE_PREVIOUS_DRAWER_PAGE]: ({
            commit,
            state,
        }, drawerKey) => {
            const pageKey = state.drawerPage[drawerKey].previousPage ?
                ? USER_STYLES_MAIN_PAGE_KEY;
            const drawerPage = cloneDeep(DRAWER_PAGES[drawerKey][pageKey]);

            commit(SET_DRAWER_PAGE, {
                drawerPage,
                drawerKey,
            });
        },

        [OPEN_SIDEBAR]: ({
            commit
        }) => commit(SET_SIDEBAR_OPEN, true),

        [OPEN_MODAL]: ({
            commit
        }, {
            name,
            settings = {},
        }) => {
            commit(SET_ACTIVE_MODAL, {
                name,
                settings,
            });
        },

        [CLOSE_MODAL]: ({
            commit
        }) => {
            commit(SET_ACTIVE_MODAL, {
                name: null,
                settings: {},
            });
        },

        [CLOSE_SIDEBAR]: ({
            commit,
            dispatch,
        }) => {
            commit(SET_SIDEBAR_OPEN, false);
            dispatch(CLOSE_HEATMAP);
        },

        [TOGGLE_SIDEBAR]: ({
            state,
            dispatch,
        }) => {
            dispatch(state.isSidebarOpen ? CLOSE_SIDEBAR : OPEN_SIDEBAR);
        },

        toggleCollapsibleSidebar: ({
            state,
            commit,
        }) => {
            commit(SET_COLLAPSIBLE_SIDEBAR, !state.isSidebarExpanded);
        },

        [OPEN_HEATMAP]: ({
            state,
            commit,
            dispatch,
        }) => {
            dispatch(CLOSE_DRAWER);

            if (!state.isHeatmapOpen) {
                commit(SET_HEATMAP_OPEN, true);
                EventLogApi.logEvent({
                    eventName: 'builder.ai_heatmap.generate_heatmap',
                });
            }
        },

        [CLOSE_HEATMAP]: ({
            state,
            commit,
        }) => {
            if (state.isHeatmapOpen) {
                commit(SET_HEATMAP_OPEN, false);
                EventLogApi.logEvent({
                    eventName: 'builder.ai_heatmap.close',
                });
            }
        },

        [TOGGLE_HEATMAP]: ({
            state,
            dispatch,
        }) => {
            dispatch(state.isHeatmapOpen ? CLOSE_HEATMAP : OPEN_HEATMAP);
        },

        [OPEN_DRAWER]: ({
            rootState,
            commit,
            dispatch,
        }, {
            id,
            settings,
        }) => {
            if (id === DRAWER_USER_STYLES) {
                EventLogApi.logEvent({
                    eventName: 'builder.styles.open',
                });
            }

            if (id === DRAWER_BLOG) {
                EventLogApi.logEvent({
                    eventName: 'builder.blog.open_sidebar',
                });
                if (rootState.user ? .id) {
                    window.hj('identify', rootState.user.id, {
                        'builder.blog.open_sidebar': true,
                    });
                }
            }

            dispatch(CLOSE_HEATMAP);
            commit(SET_ACTIVE_DRAWER, {
                id,
                settings,
            });
        },

        [CLOSE_DRAWER]: ({
            commit
        }) => commit(SET_ACTIVE_DRAWER, {
            id: null,
            settings: null,
        }),

        [TOGGLE_DRAWER]: ({
            state,
            dispatch,
        }, name) => {
            const drawerEventNameMap = {
                [DRAWER_ADD_ELEMENT]: 'website_builder.add_element.enter',
                [DRAWER_MULTI_PAGE]: 'website_builder.pages_and_navigation.enter',
                [DRAWER_USER_STYLES]: 'website_builder.website_styles.enter',
                [DRAWER_BLOG]: 'website_builder.blog.enter',
                [DRAWER_MULTILINGUAL]: 'website_builder.languages.enter',
            };

            if (drawerEventNameMap[name] && state.activeDrawer !== name) {
                EventLogApi.logEvent({
                    eventName: drawerEventNameMap[name],
                    isHostingerEvent: true,
                });
            }

            dispatch(state.activeDrawer === name ? CLOSE_DRAWER : OPEN_DRAWER, {
                id: name,
            });
        },

        [UPDATE_IS_MOBILE_SCREEN]: ({
            commit
        }, isMobile) => commit(SET_IS_MOBILE_SCREEN, isMobile),

        openPublishModal: async ({
            dispatch,
            rootGetters,
        }) => {
            if (rootGetters['user/isUserAllowedToPublish']) {
                dispatch(OPEN_MODAL, {
                    name: 'PublishModal',
                });
            } else if (rootGetters['ecommerce/isSiteWithEcommerceItems'] && rootGetters['subscription/hasExpiredOrActiveUnassignedBusinessSubscription']) {
                dispatch('subscription/handleExpiredOrActiveUnassignedSubscription', {
                    subscriptionConnectedCallback: () => dispatch(OPEN_MODAL, {
                        name: 'PublishModal',
                    }),
                    shouldShowOnlyBusinessSubscription: true,
                }, {
                    root: true,
                });
            } else if (!rootGetters['ecommerce/isSiteWithEcommerceItems'] && rootGetters['subscription/hasExpiredOrActiveUnassignedSubscription']) {
                dispatch('subscription/handleExpiredOrActiveUnassignedSubscription', {
                    subscriptionConnectedCallback: () => dispatch(OPEN_MODAL, {
                        name: 'PublishModal',
                    }),
                }, {
                    root: true,
                });
            } else {
                dispatch(OPEN_MODAL, {
                    name: 'BeforePublishModal',
                });
            }
        },

        updateBlockResizeInfo: ({
            commit
        }, blockResizeInfo) => {
            commit(SET_BLOCK_RESIZE_INFO, blockResizeInfo);
        },

        updateIsColorPickerOpen: ({
            commit
        }, isColorPickerOpen) => commit(SET_COLOR_PICKER_OPEN, isColorPickerOpen),
    },
};