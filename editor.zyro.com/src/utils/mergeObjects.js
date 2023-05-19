import cloneDeep from 'lodash.clonedeep';
import mergeWith from 'lodash.mergewith';

// Functions
export const mergeObjects = (mainObject, objectToMergeIn, mergeArrays = false) => mergeWith(
    cloneDeep(mainObject),
    objectToMergeIn,
    (objectValue, sourceValue) => {
        if (Array.isArray(objectValue)) {
            return mergeArrays ? [
                ...sourceValue,
                ...objectValue,
            ] : sourceValue;
        }

        // eslint-disable-next-line no-useless-return, consistent-return
        return;
    },
);