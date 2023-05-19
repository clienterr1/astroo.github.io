import {
    captureException
} from '@sentry/browser';

import {
    filterObject
} from '@zyro-inc/site-modules/utils/object';

import {
    createToken,
    getDataList,
    removeDataEntries,
    removeDataEntry,
    getFormEmails,
    updateFormEmail,
    resetFormEmail,
} from '@/api/UserDataApi';
import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';

export const SET_FORM_TOKEN = 'SET_FORM_TOKEN';
export const SET_FORM_EMAIL = 'SET_FORM_EMAIL';
export const SET_FORM_EMAIL_NOTIFICATIONS = 'SET_FORM_EMAIL_NOTIFICATIONS';
export const SET_FORM_NAME = 'SET_FORM_NAME';
export const SET_FORM_ENTRIES = 'SET_FORM_ENTRIES';

export default {
    namespaced: true,
    state: {
        formEntries: {},
        formEmails: {},
    },
    mutations: {
        [SET_FORM_TOKEN](state, {
            formId,
            token,
        }) {
            this.state.website.forms ? ? = {};
            this.state.website.forms[formId] ? ? = {};
            this.state.website.forms[formId].token = token;
        },
        [SET_FORM_EMAIL](state, {
            formId,
            emailData,
        }) {
            const formEmails = {
                ...state.formEmails,
                [formId]: emailData,
            };

            state.formEmails = formEmails;
        },
        [SET_FORM_EMAIL_NOTIFICATIONS](state, {
            formId,
            emailNotifications,
        }) {
            this.state.website.forms = {
                ...this.state.website.forms,
                [formId]: {
                    ...this.state.website.forms[formId],
                    emailNotifications,
                },
            };
        },
        [SET_FORM_NAME](state, {
            formId,
            name,
        }) {
            const {
                [formId]: form,
                ...restForms
            } = this.state.website.forms;

            this.state.website.forms = {
                ...restForms,
                [name]: form,
            };
        },
        [SET_FORM_ENTRIES](state, {
            formId,
            entries,
        }) {
            state.formEntries = {
                ...state.formEntries,
                [formId]: entries,
            };
        },
    },
    getters: {
        formElements: (state, getters, rootState, rootGetters) => filterObject(rootGetters.siteElements, ({
            value
        }) => value ? .type === 'GridForm'),
        formElementsArray: (state, getters) => Object.values(getters.formElements),
        // unique form ids which are used in added form elements
        uniqueFormIds: (state, getters) => [...new Set(getters.formElementsArray.map(({
            formId
        }) => formId))],
        getSavedFormEmails: (state) => (formId) => state.formEmails[formId],
        getFormToken: (state, getters, rootState, rootGetters) => (formId) => rootGetters.siteForms[formId] ? .token ? ? '',
        // eslint-disable-next-line max-len
        getFormEmailNotifications: (state, getters, rootState, rootGetters) => (formId) => !!rootGetters.siteForms[formId] ? .emailNotifications,
        getFormEntries: (state) => (formId) => state.formEntries[formId] ? ? [],
        isWebsiteWithForms: (state, getters) => getters.formElementsArray.length > 0,
        getCurrentFormEmail: (state) => (formId) => state.formEmails[formId] ? .pendingFormEmail ?
            ? state.formEmails[formId] ? .currentFormEmail,
        isFormEmailChangePending: (state) => (formId) => !!state.formEmails[formId] ? .pendingFormEmail ? ? false,
    },
    actions: {
        initForms: ({
            getters,
            rootGetters,
            dispatch,
        }) => {
            getters.uniqueFormIds.forEach((formId) => {
                if (!rootGetters.siteForms[formId] ? .token) {
                    dispatch('generateToken', {
                        formId,
                    });
                }
            });
        },
        generateToken: async ({
            commit,
            dispatch,
            rootState,
        }, {
            formId
        }) => {
            try {
                const {
                    websiteId
                } = rootState;

                const token = websiteId ?
                    (await createToken(formId, websiteId)).data.token :
                    null;

                commit(SET_FORM_TOKEN, {
                    formId,
                    token,
                });
            } catch (error) {
                console.error(error);
                // this is an absolute workaround - 404 status is thrown when there is an issue with sessions in backend
                // this happens only the first time a user selects template with a form
                // a (possibly) race condition happens when site token is being created and site id is needed which is not created yet
                // this escape only supresses error notification which happens quite often for new users
                if (error.response ? .status !== 404) {
                    dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                        origin: 'Vuex forms store',
                        messageI18nKeyPath: 'builder.notifications.errorAddingForm',
                        submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
                        submitCallback: () => dispatch('generateToken', {
                            formId,
                        }),
                    }, {
                        root: true,
                    });
                }

                captureException(error);
            }
        },
        updateFormEmail: async ({
            getters,
            dispatch,
        }, {
            formId,
            newFormEmail,
        }) => {
            const token = getters.getFormToken(formId);

            if (!token) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorChangingFormEmail',
                }, {
                    root: true,
                });

                return;
            }

            try {
                await updateFormEmail({
                    token,
                    newFormEmail,
                });

                await dispatch('fetchCurrentAndPendingFormEmails', {
                    formId,
                    force: true,
                });

                return;
            } catch (error) {
                console.error(error);
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorChangingFormEmail',
                    submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
                    submitCallback: () => dispatch('updateFormEmail', {
                        formId,
                        newFormEmail,
                    }),
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        resetFormEmail: async ({
            getters,
            dispatch,
        }, {
            formId
        }) => {
            const token = getters.getFormToken(formId);

            if (!token) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorChangingFormEmail',
                }, {
                    root: true,
                });

                return;
            }

            try {
                await resetFormEmail({
                    token,
                });

                await dispatch('fetchCurrentAndPendingFormEmails', {
                    formId,
                    force: true,
                });

                return;
            } catch (error) {
                console.error(error);
                if (error.response ? .status === 410) {
                    await dispatch('fetchCurrentAndPendingFormEmails', {
                        formId,
                        force: true,
                    });

                    captureException(error);

                    return;
                }

                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorChangingFormEmail',
                    submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
                    submitCallback: () => dispatch('resetFormEmail', {
                        formId,
                    }),
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        updateFormEmailNotifications: ({
            commit,
            rootGetters,
        }, {
            formId,
            emailNotifications,
        }) => {
            if (rootGetters.siteForms[formId]) {
                commit(SET_FORM_EMAIL_NOTIFICATIONS, {
                    formId,
                    emailNotifications,
                });
            }
        },
        createFormInbox: async ({
            rootGetters,
            dispatch,
        }, {
            formId
        }) => {
            if (rootGetters.siteForms[formId]) {
                return;
            }

            await dispatch('generateToken', {
                formId,
            });
        },
        fetchCurrentAndPendingFormEmails: async ({
            commit,
            getters,
            dispatch,
        }, {
            formId,
            force = false,
        }) => {
            try {
                const token = getters.getFormToken(formId);

                const formEmails = getters.getSavedFormEmails(formId);

                if (formEmails && !force) {
                    return;
                }

                const {
                    data
                } = await getFormEmails({
                    token,
                });

                // Saving form emails locally, so we would not fetch them on each form setting reopen
                commit(SET_FORM_EMAIL, {
                    formId,
                    emailData: data,
                });

                return;
            } catch (error) {
                console.error(error);
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorLoadingContactFormEmail',
                    submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
                    submitCallback: () => dispatch('fetchFormEntries', {
                        formId,
                    }),
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        fetchFormEntries: async ({
            dispatch,
            commit,
            rootGetters,
        }, {
            formId
        }) => {
            try {
                const {
                    data
                } = await getDataList(rootGetters.siteForms[formId].token);

                commit(SET_FORM_ENTRIES, {
                    formId,
                    entries: data,
                });
            } catch (error) {
                console.error(error);
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorLoadingEntries',
                    submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
                    submitCallback: () => dispatch('fetchFormEntries', {
                        formId,
                    }),
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        deleteEntry: async ({
            getters,
            commit,
            dispatch,
            rootGetters,
        }, {
            formId,
            entryId,
        }) => {
            try {
                await removeDataEntry(rootGetters.siteForms[formId].token, entryId);

                commit(SET_FORM_ENTRIES, {
                    formId,
                    entries: getters.getFormEntries(formId).filter((entry) => entry.id !== entryId),
                });
            } catch (error) {
                console.error(error);
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorRemovingEntry',
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        deleteEntries: async ({
            getters,
            dispatch,
            commit,
            rootGetters,
        }, {
            checkboxes,
            formId,
        }) => {
            try {
                await removeDataEntries(
                    rootGetters.siteForms[formId].token,
                    checkboxes.checked,
                );

                commit(SET_FORM_ENTRIES, {
                    formId,
                    entries: getters.getFormEntries(formId).filter((entry) => !checkboxes.checked.includes(entry.id)),
                });
            } catch (error) {
                console.error(error);
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex forms store',
                    messageI18nKeyPath: 'builder.notifications.errorRemovingEntries',
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
    },
};