import {
    createNamespacedHelpers
} from 'vuex';

import {
    MODAL_DEFAULT_NOTIFICATION
} from '@/constants';
import {
    GUI_NAMESPACE,
    OPEN_MODAL,
} from '@/store/builder/gui';
import {
    generateRandomId
} from '@/utils/generateRandomId';

export const NOTIFICATION_TYPE_TOAST = 'toast';
export const NOTIFICATION_TYPE_MODAL = 'modal';
export const NOTIFICATION_TYPE_RENDERLESS = 'renderless'; // when UI is handled inside component

// TODO: only toast and modal types implemented for POC.
export const NOTIFICATION_TYPE_ALERT = 'alert';
export const NOTIFICATION_TYPE_DIALOG = 'dialog';
export const NOTIFICATION_TYPE_EMPTY = 'empty';

const DEFAULT_NOTIFY_PAYLOAD = {
    type: NOTIFICATION_TYPE_TOAST, // defaults for toast, if none provided
    origin: null, // component's name or a custom string to distinguish where the error came from
    title: null, // for modals / alerts / dialogs
    message: null, // if provided, should override the components message
    isClosable: true, // can a user close it?
    autoCloseTimeout: null, // after what tim (in ms) should notification be closed?
    autoSubmit: false, // should it recover after a timeout?
    submitLabel: null, // label for submit button (i.e. 'retry', 'undo')
    submitCallback: null, // callback to execute to recover from error, retry, undo etc
    closeCallback: null, // callback to execute upon closing toast/modal
    closeOnSubmit: true, // whether to close notification on submit
    props: {}, // implementation specific props, like toast icon or modal component name
};

// namespacing to use with `createNamespacedHelpers`
export const NOTIFICATIONS_NAMESPACE = 'notifications';

// action type constants:
export const NOTIFY = 'NOTIFY';
export const CREATE_TOAST = 'CREATE_TOAST';
export const DELETE_TOAST = 'DELETE_TOAST';
export const CREATE_MODAL = 'CREATE_MODAL';
export const SHOW_TOOLTIP = 'SHOW_TOOLTIP';

// mutation type constants:
export const PUSH_TO_LOG = 'PUSH_TO_LOG';
export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';

export const {
    mapState: mapStateNotifications,
    mapGetters: mapGettersNotifications,
    mapActions: mapActionsNotifications,
    mapMutations: mapMutationsNotifications,
} = createNamespacedHelpers(NOTIFICATIONS_NAMESPACE);

export default {
    namespaced: true,
    state: {
        log: [],
        toasts: [],
        latest: null,
    },
    mutations: {
        [PUSH_TO_LOG]: (state, notification) => {
            state.log = {
                ...state.log,
                [notification.id]: notification,
            };
        },
        [ADD_TOAST]: (state, notification) => {
            state.toasts = [
                ...state.toasts,
                notification,
            ];
        },
        [REMOVE_TOAST]: (state, id) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
        },
    },
    actions: {
        [NOTIFY]: ({
            commit,
            dispatch,
        }, payload = {}) => {
            const notification = {
                ...DEFAULT_NOTIFY_PAYLOAD,
                ...payload,
                id: generateRandomId(), // generate ID to help finding item in log
                timeStamp: Date.now(), // generate timeStamp for filtering, sorting etc
            };

            commit(PUSH_TO_LOG, notification);

            switch (notification.type) {
                case NOTIFICATION_TYPE_MODAL:
                    return dispatch(CREATE_MODAL, notification);
                    // case NOTIFICATION_TYPE_DIALOG: return dispatch(CREATE_DIALOG, notification);
                    // case NOTIFICATION_TYPE_ALERT: return dispatch(CREATE_ALERT, notification);
                    // case NOTIFICATION_TYPE_EMPTY: return dispatch(CREATE_EMPTY, notification);
                case NOTIFICATION_TYPE_RENDERLESS:
                    return false;
                default:
                    return dispatch(CREATE_TOAST, notification); // NOTIFICATION_TYPE_TOAST
            }
        },
        [CREATE_TOAST]: ({
            commit
        }, notification) => {
            commit(ADD_TOAST, notification);
            if (notification.autoCloseTimeout) {
                setTimeout(() => commit(REMOVE_TOAST, notification.id), notification.autoCloseTimeout);
            }
        },
        [DELETE_TOAST]: ({
            commit
        }, id) => {
            commit(REMOVE_TOAST, id);
        },
        [CREATE_MODAL]: ({
            dispatch
        }, notification) => {
            dispatch(
                `${GUI_NAMESPACE}/${OPEN_MODAL}`, {
                    name: notification.props.modalName ? ? MODAL_DEFAULT_NOTIFICATION,
                    settings: {
                        ...notification.props, // flatten custom notification props
                        ...notification,
                    },
                }, {
                    root: true,
                },
            );
        },
    },
};

/**
 * NEXT ITERATION:
 *
 * - toast icons
 * - toast variations (info, danger, warning, success)
 * - toast animation
 * - auto close/submit timers
 *
 */