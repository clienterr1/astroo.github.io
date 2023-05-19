import {
    create,
    clone,
    formatters,
} from 'jsondiffpatch';

// Create patcher instance with config
// Comments from the docs: https://github.com/benjamine/jsondiffpatch/
export const patcher = create({
    // used to match objects when diffing arrays, by default only === operator is used
    objectHash(object, index) {
        // this function is used only to when objects are not equal by ref
        // eslint-disable-next-line no-underscore-dangle
        return `$$index:${index}` || object._id || object.id;
    },
    arrays: {
        // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
        detectMove: true,
        // default false, the value of items moved is not included in deltas
        includeValueOnMove: true,
    },
    textDiff: {
        // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
        minLength: Number.POSITIVE_INFINITY,
    },
    cloneDiffValues: true,
    // default false. if true, values in the obtained delta will be cloned
    // (using patcher.clone by default), to ensure delta keeps no references to left or right objects.
    // this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
    // instead of true, a function can be specified here to provide a custom clone(value)
});

export const revertDiff = (object, diff) => {
    const objectClone = clone(object);

    patcher.unpatch(objectClone, diff);

    return objectClone;
};

export const applyDiff = (object, diff) => {
    const objectClone = clone(object);

    patcher.patch(objectClone, diff);

    return objectClone;
};

export const createDiff = (current, previous) => patcher.diff(current, previous);
export const formatDiff = (diff) => formatters.jsonpatch.format(diff);