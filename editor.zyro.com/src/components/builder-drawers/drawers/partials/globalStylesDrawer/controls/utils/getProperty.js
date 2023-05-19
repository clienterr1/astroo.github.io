import {
    STATE_NORMAL
} from '@zyro-inc/site-modules/constants/globalStyles';

const MOBILE_PREFIX = 'm-';

/**
 * Constructs property name with given parameters
 * @param property - takes global-styles property
 * @see {module:GLOBAL_STYLE_PROPERTIES} for available global styles property list
 * @param state {'normal' | 'hover'} - adds state to the property
 * @param mobile {Boolean} - adds mobile prefix if property is mobile
 * @returns {String} - constructed property name from the given parameters
 */
export const getProperty = (property, state = STATE_NORMAL, mobile = false) => {
    const propertyState = (!state || state === STATE_NORMAL) ? '' : `-${state}`;

    return mobile ? `${MOBILE_PREFIX}${property}${propertyState}` : `${property}${propertyState}`;
};

export const isMobileProperty = (property) => property.includes('m-');

export const extractMobileProperty = (property) => property.replace(/m-/g, '');