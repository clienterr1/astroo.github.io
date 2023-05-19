import * as Sentry from '@sentry/browser';

import {
    getUnusedHostingerDomain
} from '@/api/HostingerIntegrationApi';
import {
    getUser as getUserApi
} from '@/api/UsersApi';
import {
    GO_ROBOTS_EMAIL,
    GO_ROBOTS_EMAIL_FREE_PUBLISH,
    HOSTINGER_REF,
} from '@/constants';

export const SET_UNUSED_HOSTINGER_DOMAIN = 'SET_UNUSED_HOSTINGER_DOMAIN';
export const SET_IS_AUTH_INITIATED = 'SET_IS_AUTH_INITIATED';

export default {
    namespaced: true,
    state: {
        user: null,
        isAuthInitiated: false,
        hostingerDomain: null,
    },
    getters: {
        isZyroUser: (state) => /@(zyro|hostinger)\.com$/.test(state.user ? .email),
        isGoRobotsUser: (state) => state.user ? .email ? .includes(GO_ROBOTS_EMAIL),
        isGoRobotsFreePublishUser: (state) => state.user ? .email.includes(GO_ROBOTS_EMAIL_FREE_PUBLISH),
        isHostingerRef: (state) => state.user ? .ref === HOSTINGER_REF,
        isUserAllowedToPublish: (state, getters, rootState, rootGetters) => {
            const isFreeUser = getters.isZyroUser || getters.isGoRobotsFreePublishUser;

            return isFreeUser || rootGetters['subscription/hasActiveSubscription'];
        },
        isAbleToConnectHostingerDomain: (state, getters) => !!(getters.isHostingerRef && state.hostingerDomain),
        getUserEmail: (state) => state.user ? .email,
        userId: (state) => state.user ? .id,
        userHpanelId: (state) => state.user ? .hPanelId,
    },
    mutations: {
        [SET_IS_AUTH_INITIATED]: (state, payload) => {
            state.isAuthInitiated = payload;
        },
        setUser: (state, user) => {
            state.user = user;
        },
        [SET_UNUSED_HOSTINGER_DOMAIN]: (state, hostingerDomain) => {
            state.hostingerDomain = hostingerDomain;
        },
    },
    actions: {
        getUser: async ({
            state,
            commit,
            rootState,
            dispatch,
        }) => {
            if (state.isAuthInitiated) {
                return;
            }

            commit(SET_IS_AUTH_INITIATED, true);
            const user = await getUserApi();

            if (user) {
                // We need to enable data-qa only for specific QA account. If that account is used, then a specific qa key is added
                // to data.json meta. Later, based on this key, special directive enables or not data-qa
                if (user.email ? .includes(GO_ROBOTS_EMAIL)) {
                    commit('setWebsiteMeta', {
                        key: 'qa',
                        value: true,
                    }, {
                        root: true,
                    });
                    await dispatch('saving/saveWebsite', {}, {
                        root: true,
                    });
                }

                commit('setUser', user);

                const sentryUserDetails = {
                    email: user.email,
                    id: user.id,
                    CRM: `https://crm.zyro.com/#/user/${user.id}`,
                };

                if (rootState.websiteId) {
                    sentryUserDetails.siteId = rootState.websiteId;
                }

                if (rootState.zyroDomain) {
                    sentryUserDetails.domain = rootState.zyroDomain;
                }

                Sentry.setUser(sentryUserDetails);
            }
        },
        setHostingerDomain: async ({
            commit,
            getters,
        }) => {
            if (!getters.isHostingerRef) {
                return;
            }

            const hostingerDomain = await getUnusedHostingerDomain();

            commit(SET_UNUSED_HOSTINGER_DOMAIN, hostingerDomain);
        },
    },
};