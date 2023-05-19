import {
    addBreadcrumb,
    captureException,
} from '@sentry/browser';

import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';

import {
    saveSite
} from '@/api/SitesApi';
import {
    patcher,
    createDiff,
} from '@/utils/jsondiffpatch';
import {
    getSiteMetaFlags
} from '@/utils/getSiteMetaFlags';

const AUTOSAVE_INTERVAL = 120000; // autosave every 2 minutes

export const SET_IS_SAVING = 'SET_IS_SAVING';
export const SET_SITE_DATA_SNAPSHOT = 'SET_SITE_DATA_SNAPSHOT';
export const SET_CLIENT_TIMESTAMP = 'SET_CLIENT_TIMESTAMP';
export const SET_TIMER = 'SET_TIMER';
export const CLEAR_TIMER = 'CLEAR_TIMER';

const getErrorMessage = (error) => {
    const {
        response,
        message,
    } = error;

    switch (response ? .status) {
        case 401:
            return 'builder.unauthorizedSavingNotification';
        case 409:
            return 'builder.changesOnMultipleDevices';
            // default fallback in following order: message from status -> message from server -> default fallback message
        default:
            return response ? .statusText ? ? message ? ? 'builder.defaultSavingNotification';
    }
};

export default {
    namespaced: true,
    state: {
        isSaving: false,
        clientTimestamp: null, // timestamp, received after successful save. it was not renamed due to backwards compatibility
        siteDataSnapshot: null, // used to deep compare with current website data and is reset after successful save
        timer: null, // setTimeout identifier
    },
    getters: {
        // explicitly setting/getting diff as undefined because jsondiffpatch returns undefined when objects are deep equal
        unsavedSiteDataDiff: (state, getters, rootState) => (state.siteDataSnapshot ?
            createDiff(state.siteDataSnapshot, rootState.website) :
            undefined),
        hasUnsavedChanges: (state, getters) => typeof getters.unsavedSiteDataDiff !== 'undefined',
        canSave: (state, getters, rootState) => rootState.websiteId && getters.hasUnsavedChanges && !state.isSaving,
    },
    mutations: {
        [SET_SITE_DATA_SNAPSHOT]: (state, value) => {
            state.siteDataSnapshot = value;
        },
        [SET_IS_SAVING]: (state, value) => {
            state.isSaving = value;
        },
        [SET_CLIENT_TIMESTAMP]: (state, value) => {
            state.clientTimestamp = value;
        },
        [SET_TIMER]: (state, timer) => {
            state.timer = timer;
        },
        [CLEAR_TIMER]: (state) => {
            clearInterval(state.timer);
        },
    },
    actions: {
        updateClientTimestamp: ({
            commit
        }, timestamp) => {
            commit(SET_CLIENT_TIMESTAMP, timestamp);
        },
        createSiteDataSnapshot: ({
            commit
        }, {
            siteData
        }) => {
            commit(SET_SITE_DATA_SNAPSHOT, patcher.clone(siteData));
        },
        saveWebsite: async ({
            state,
            rootState,
            dispatch,
            commit,
        }, {
            saveWhenImpersonating = false
        } = {}) => {
            const {
                user,
                website,
                websiteId,
                isDemoMode,
            } = rootState;

            if ((user.user ? .impersonating && !saveWhenImpersonating) || isDemoMode) {
                return;
            }

            commit(CLEAR_TIMER);
            commit(SET_IS_SAVING, true);

            addBreadcrumb({
                category: 'CLIENT_TIMESTAMP',
                message: 'Before Save',
                data: {
                    clientTimestamp: state.clientTimestamp,
                },
            });

            try {
                const siteMetaFlags = getSiteMetaFlags({
                    siteData: website,
                });
                const {
                    data
                } = await saveSite(websiteId, website, state.clientTimestamp, siteMetaFlags);

                addBreadcrumb({
                    category: 'CLIENT_TIMESTAMP',
                    message: 'After Save',
                    data: {
                        clientTimestamp: data.clientTimestamp,
                    },
                });

                dispatch('updateClientTimestamp', data.clientTimestamp);
                dispatch('createSiteDataSnapshot', {
                    siteData: website,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    messageI18nKeyPath: getErrorMessage(error),
                    submitLabelI18nKeyPath: 'common.reload',
                    submitCallback: () => window.location.reload(),
                    origin: 'Vuex saving store, saveWebsite',
                }, {
                    root: true,
                });
                console.error(error);
                captureException(error);

                throw error;
            } finally {
                dispatch('startSavingTimer');
                commit(SET_IS_SAVING, false);
            }
        },
        startSavingTimer: ({
            getters,
            dispatch,
            commit,
            rootState,
        }) => {
            if (rootState.user.user ? .impersonating) return;

            const timer = setInterval(() => {
                if (getters.canSave) {
                    dispatch('saveWebsite');
                }
            }, AUTOSAVE_INTERVAL);

            commit(SET_TIMER, timer);
        },
    },
};