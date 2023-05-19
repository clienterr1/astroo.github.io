import * as Sentry from '@sentry/browser';

import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';

import {
    revertDiff,
    patcher,
    applyDiff,
    createDiff,
} from '@/utils/jsondiffpatch';

export const SET_HISTORY = 'SET_HISTORY';
export const SET_REDO_HISTORY = 'SET_REDO_HISTORY';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export default {
    namespaced: true,
    state: {
        history: [],
        redoHistory: [],
        initialSiteData: null, // Initial data before any changes were snapshot
    },
    getters: {
        isUndoDisabled: (state) => state.history.length <= 0,
        isRedoDisabled: (state) => state.redoHistory.length <= 0,
    },
    mutations: {
        [SET_HISTORY]: (state, value) => {
            state.history = value;
        },
        [SET_REDO_HISTORY]: (state, value) => {
            state.redoHistory = value;
        },
        [SET_INITIAL_STATE]: (state, value) => {
            state.initialSiteData = patcher.clone(value);
        },
    },
    actions: {
        resetUndoRedo: ({
            commit,
            rootState,
        }) => {
            commit(SET_HISTORY, []);
            commit(SET_REDO_HISTORY, []);
            commit(SET_INITIAL_STATE, rootState ? .website);
        },
        setInitialSiteData: ({
            commit,
            rootState,
        }) => {
            commit(SET_INITIAL_STATE, rootState.website);
        },
        createSnapshot: ({
            dispatch,
            rootState,
            state,
        }) => {
            // Apply all diffs to build previous site data
            const previousSiteData = state.history.reduce((acc, {
                diff
            }) => applyDiff(acc, diff), state.initialSiteData);
            const diff = createDiff(previousSiteData, rootState.website);

            if (diff) {
                dispatch('pushToHistory', {
                    diff,
                });
            }
        },
        pushToHistory: ({
            state,
            commit,
        }, value) => {
            if (!value.diff) {
                return;
            }

            commit(SET_HISTORY, [
                ...state.history,
                value,
            ]);

            commit(SET_REDO_HISTORY, []);
        },
        executeUndo: ({
            state,
            dispatch,
            commit,
            rootState,
        }) => {
            if (state.history.length === 0) {
                return;
            }

            // When undoing, revert all current diffs to site data before reverting any diffs from history
            const previousSiteData = state.history.reduce((acc, {
                diff
            }) => applyDiff(acc, diff), state.initialSiteData);
            const diff = createDiff(previousSiteData, rootState.website);

            if (diff) {
                const newWebsiteData = revertDiff(rootState.website, diff);

                dispatch('overwriteWebsiteData', {
                    websiteData: newWebsiteData,
                }, {
                    root: true,
                });
            }

            dispatch('unselectCurrentElement', null, {
                root: true,
            });

            dispatch('updateCurrentBlockId', null, {
                root: true,
            });

            const action = state.history[state.history.length - 1];

            commit(SET_HISTORY, state.history.slice(0, -1));

            try {
                const newWebsiteData = revertDiff(rootState.website, action.diff);

                // Make sure undo stack is updated to have the latest changes, even those that were not pushed to history
                const redoDiff = createDiff(newWebsiteData, rootState.website);

                dispatch('overwriteWebsiteData', {
                    websiteData: newWebsiteData,
                }, {
                    root: true,
                });

                commit(SET_REDO_HISTORY, [
                    ...state.redoHistory,
                    {
                        diff: redoDiff,
                    },
                ]);
            } catch (error) {
                dispatch('resetUndoRedo');
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'executeUndo',
                    message: 'Error while undoing changes.',
                }, {
                    root: true,
                });
                Sentry.captureException(new Error('Error while undoing changes'));
                throw error;
            }
        },
        executeRedo: ({
            state,
            dispatch,
            commit,
            rootState,
        }) => {
            if (state.redoHistory.length === 0) {
                return;
            }

            dispatch('unselectCurrentElement', null, {
                root: true,
            });

            dispatch('updateCurrentBlockId', null, {
                root: true,
            });

            const action = state.redoHistory[state.redoHistory.length - 1];

            commit(SET_REDO_HISTORY, state.redoHistory.slice(0, -1));

            try {
                const newWebsiteData = applyDiff(rootState.website, action.diff);

                dispatch('overwriteWebsiteData', {
                    websiteData: newWebsiteData,
                }, {
                    root: true,
                });

                commit(SET_HISTORY, [
                    ...state.history,
                    action,
                ]);
            } catch (error) {
                dispatch('resetUndoRedo');
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'executeRedo',
                    message: 'Error while redoing changes.',
                }, {
                    root: true,
                });
                Sentry.captureException(new Error('Error while redoing changes'));
                throw error;
            }
        },
    },
};