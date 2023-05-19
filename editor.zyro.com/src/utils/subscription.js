export const SUBSCRIPTION_STATUS_ACTIVE = 'ACTIVE';
export const SUBSCRIPTION_STATUS_NON_RENEWING = 'NON_RENEWING';
export const SUBSCRIPTION_STATUS_CANCELLED = 'CANCELLED';
const ACTIVE_SUBSCRIPTION_STATUSES = [
    SUBSCRIPTION_STATUS_ACTIVE,
    SUBSCRIPTION_STATUS_NON_RENEWING,
];

export const SUBSCRIPTION_PLAN_PREFIX_ECOMMERCE = 'ECOMMERCE';
export const SUBSCRIPTION_PLAN_PREFIX_UNLEASH = 'UNLEASH';
export const SUBSCRIPTION_PLAN_PREFIX_BUSINESS = 'BUSINESS';

export const isSubscriptionActive = ({
    status
}) => ACTIVE_SUBSCRIPTION_STATUSES.includes(status);
export const isSubscriptionExpired = ({
    status
}) => status === SUBSCRIPTION_STATUS_CANCELLED;
export const isSubscriptionEcommerce = ({
    plan
}) => plan.startsWith(SUBSCRIPTION_PLAN_PREFIX_ECOMMERCE);
export const isSubscriptionBusiness = ({
    plan
}) => plan.startsWith(SUBSCRIPTION_PLAN_PREFIX_BUSINESS);