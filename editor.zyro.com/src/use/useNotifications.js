import {
    useStore
} from 'vuex';

import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';

export const useNotifications = () => {
    const {
        dispatch
    } = useStore();

    const notify = (props) => dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, props);

    return {
        notify,
    };
};