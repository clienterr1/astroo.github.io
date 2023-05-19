import {
    isObject
} from '@zyro-inc/site-modules/utils/object';
import {
    parseCSSSides
} from '@zyro-inc/site-modules/utils/parseCSSSides';

const UNFOLDABLE_STYLE_KEYS = [
    'padding',
    'm-padding',
    'block-padding',
];

/**
 * Recursive function which constructs a CSS variable object
 *
 * 1) Prefixes current key with previousKey, if provided
 * 2) If current value is an object, recurses and passes the prefixed key as previousKey.
 * If it is not an object, there is no deeper nesting,
 * so constructed key and the value is added to the returned object.
 *
 * @param {object} obj Object to be converted to CSS variables
 * @param {string} previousKey Used in recurssion as prefix to current key
 * @returns {object} Object of constructed CSS variables
 */
export const objectToCssVariables = (object, previousKey = '') => {
    if (!isObject(object)) {
        return {};
    }

    return Object.entries(object)
        .reduce((accumulator, [key, value]) => {
            const cssVariableKey = previousKey ? `${previousKey}-${key}` : `--${key}`;

            if (isObject(value)) {
                return {
                    ...accumulator,
                    ...objectToCssVariables(value, cssVariableKey),
                };
            }

            const newStyle = UNFOLDABLE_STYLE_KEYS.includes(key) ?
                Object.entries(parseCSSSides(value))
                .reduce(
                    (styleStringCurrent, [side, styleValue]) => ({
                        ...styleStringCurrent,
                        [`${cssVariableKey}-${side}`]: styleValue,
                        [cssVariableKey]: value,
                    }), {},
                ) :
                ({
                    [cssVariableKey]: value,
                });

            return {
                ...accumulator,
                ...newStyle,
            };
        }, {});
};