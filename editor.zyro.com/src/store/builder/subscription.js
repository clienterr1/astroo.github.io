import {
    getSiteSubscription,
    getSitesSubscriptions,
} from '@/api/BillingApi';
import {
    OPEN_MODAL,
    GUI_NAMESPACE,
} from '@/store/builder/gui';
import {
    isSubscriptionActive,
    isSubscriptionExpired,
    isSubscriptionEcommerce,
    isSubscriptionBusiness,
} from '@/utils/subscription';

export const SET_SUBSCRIPTION = 'SET_SUBSCRIPTION';
export const SET_SITES_SUBSCRIPTIONS = 'SET_SITES_SUBSCRIPTIONS';

export default {
    namespaced: true,
    state: {
        subscription: null,
        sitesSubscriptions: [],
    },
    getters: {
        subscriptionId: (state) => state.subscription && state.subscription.id,
        // Site subscription getters
        activeSitesSubscriptions: (state) => state.sitesSubscriptions.filter(
            (subscription) => isSubscriptionActive(subscription),
        ),
        hasActiveSubscription: (state) => (state.subscription ? isSubscriptionActive(state.subscription) : false),
        hasExpiredSubscription: (state) => (state.subscription ? isSubscriptionExpired(state.subscription) : false),
        hasActiveUnassignedSubscription: (state, getters) => !!getters.activeUnassignedSubscriptions.length,
        hasExpiredOrActiveUnassignedSubscription: (state, getters) => (
            getters.hasExpiredSubscription || getters.hasActiveUnassignedSubscription
        ),
        // Site subscription getters, related with eCommerce
        hasEcommerceSubscription: (state) => (state.subscription ? isSubscriptionEcommerce(state.subscription) : false),
        hasBusinessSubscription: (state) => (state.subscription ? isSubscriptionBusiness(state.subscription) : false),

        hasActiveEcommerceSubscription: (state, getters) => getters.hasActiveSubscription && getters.hasEcommerceSubscription,
        hasActiveBusinessSubscription: (state, getters) => getters.hasActiveSubscription && getters.hasBusinessSubscription,

        hasActiveUnassignedEcommerceSubscription: (state, getters) => !!getters.activeUnassignedEcommerceSubscriptions.length,
        hasActiveUnassignedBusinessSubscription: (state, getters) => (!!getters.activeUnassignedBusinessSubscriptions.length),
        hasExpiredOrActiveUnassignedEcommerceSubscription: (state, getters) => (
            getters.hasExpiredSubscription || getters.hasActiveUnassignedEcommerceSubscription
        ),
        hasExpiredOrActiveUnassignedBusinessSubscription: (state, getters) => (
            getters.hasExpiredSubscription || getters.hasActiveUnassignedBusinessSubscription
        ),

        // Subscriptions list getters
        activeSubscriptions: (state) => state.sitesSubscriptions.filter(isSubscriptionActive),
        activeUnassignedSubscriptions: (state, getters) => getters.activeSubscriptions.filter(({
            siteId
        }) => !siteId),
        activeUnassignedEcommerceSubscriptions: (state, getters) => getters.activeUnassignedSubscriptions.filter(isSubscriptionEcommerce),
        activeUnassignedBusinessSubscriptions: (state, getters) => getters.activeUnassignedSubscriptions.filter(isSubscriptionBusiness),

        isOnlyEcwidStoreAvailable: (state, getters) => (!getters.hasBusinessSubscription && (getters.hasActiveUnassignedEcommerceSubscription || getters.hasEcommerceSubscription)),
    },
    mutations: {
        [SET_SUBSCRIPTION]: (state, subscription) => {
            state.subscription = subscription;
        },
        [SET_SITES_SUBSCRIPTIONS]: (state, subscriptions) => {
            state.sitesSubscriptions = subscriptions;
        },
    },
    actions: {
        getSubscription: async ({
            commit,
            rootState,
        }) => {
            const subscription = (await getSiteSubscription(rootState.websiteId)) ? ? null;

            commit(SET_SUBSCRIPTION, subscription);
        },
        getSitesSubscriptions: async ({
            commit
        }) => {
            const siteSubscriptions = await getSitesSubscriptions();

            const mappedSubscriptions = siteSubscriptions.map((subscription) => {
                // Slices off last two letters (BASIC1Y -> BASIC, ECOMMERCE4Y -> ECOMMERCE, etc.)
                const planNameWithoutDuration = subscription.plan.substring(0, subscription.plan.length - 2);

                return {
                    ...subscription,
                    planNameWithoutDuration,
                };
            });

            commit(SET_SITES_SUBSCRIPTIONS, mappedSubscriptions);
        },
        /**
         * Checks if user has an expired subscription. If yes - opens expired subscription modal. Else, if user has active unassiged
         * subscription, opens the subscription connection modal with the given properties.
         * @param {function} subscriptionConnectedCallback - function to call after the subscription has been connected
         * @param {boolean} shouldShowOnlyEcommerceSubscriptions - should subscription connection modal show only ecommerce subscriptions
         * @param {boolean} shouldShowOnlyBusinessSubscription - should subscription connection modal show only business subscription
         */
        handleExpiredOrActiveUnassignedSubscription: async ({
            dispatch,
            getters,
        }, {
            subscriptionConnectedCallback,
            shouldShowOnlyEcommerceSubscriptions = false,
            shouldShowOnlyBusinessSubscription = false,
        } = {}) => {
            if (getters.hasExpiredSubscription) {
                dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
                    name: 'SubscriptionExpiredModal',
                }, {
                    root: true,
                });
            } else if (getters.hasActiveUnassignedSubscription) {
                dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
                    name: 'ConnectSubscriptionModal',
                    settings: {
                        subscriptionConnectedCallback,
                        shouldShowOnlyEcommerceSubscriptions,
                        shouldShowOnlyBusinessSubscription,
                    },
                }, {
                    root: true,
                });
            }
        },
    },
};