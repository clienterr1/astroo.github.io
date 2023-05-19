/**
 * Returns lowest element in section bottom position,
 * @param {blockElements} blockElements - array of block elements
 * @param {elementPositionKey} elementPositionKey - device on which lowest element bottom should be returned
 *
 * @returns lowest element bottom
 */

export const getLowestElementBottom = ({
    blockElements,
    elementPositionKey,
}) => {
    if (!blockElements ? .length) {
        return 0;
    }

    return Math.max(
        ...blockElements.map((element) => element[elementPositionKey].top + element[elementPositionKey].height),
    );
};