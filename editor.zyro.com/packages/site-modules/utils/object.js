export const filterObject = (objectToFilter, filterFunction) => Object.fromEntries(
    Object.entries(objectToFilter).filter(
        ([key, value], index, array) => filterFunction({
            key,
            value,
            index,
            array,
        }),
    ),
);

/**
 * Maps each object to a value returned by the mapFunction
 */
export const mapObject = (objectToMap, mapFunction) => Object.fromEntries(
    Object.entries(objectToMap).map(
        ([key, value], index, array) => [
            key,
            mapFunction({
                key,
                value,
                index,
                array,
            }),
        ],
    ),
);

/**
 * Returns true if value is an object, returns false if value is false
 * @param value
 * @returns {boolean}
 */
export const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

/**
 * Gets a key/value object entry. If the value is not specified/does not exist,
 * returns the 'default' value (works similar to switch)
 * @param {string} key - key of the value to get
 * @param {object} map - map from which to get the value
 */
export const getMapValue = (key, map) => (key in map ? map[key] : map.default);

/**
 * Recursively checks if an object has nullish (null or undefined) values and removes them.
 * @param {object} object - Ojbect to look for nullish values
 * @returns {object} - Object without nullish values
 */
export const removeNullishEntries = (object) => {
    if (!isObject(object)) {
        return object;
    }

    return Object.entries(object).reduce((acc, [key, value]) => {
        if (value != null) {
            acc[key] = removeNullishEntries(value);
        }

        return acc;
    }, {});
};