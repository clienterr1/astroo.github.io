// https://javascript.info/task/shuffle
export const shuffleArray = (array) => {
    const arrayCopy = [...array];

    for (let index = arrayCopy.length - 1; index > 0; index -= 1) {
        const nextIndex = Math.floor(Math.random() * (index + 1));

        [arrayCopy[index], arrayCopy[nextIndex]] = [
            arrayCopy[nextIndex],
            arrayCopy[index],
        ];
    }

    return arrayCopy;
};

export const getRandomArrayItem = (array) => array[Math.floor(Math.random() * array.length)];

export const moveOneLeft = (array, name) => {
    const copy = [...array];
    const oldIndex = copy.indexOf(name); // find old value index
    const oldValue = copy[oldIndex]; // minimum at 0
    const lowerIndex = Math.max(0, oldIndex - 1);
    const lowerValue = copy[lowerIndex];

    copy[oldIndex] = lowerValue;
    copy[lowerIndex] = oldValue;

    return copy;
};

export const moveOneRight = (array, name) => {
    const copy = [...array];
    const oldIndex = copy.indexOf(name); // find old value index
    const oldValue = copy[oldIndex];
    // highest index can be array length - 1s
    const higherIndex = Math.min(copy.length - 1, oldIndex + 1);
    const upperValue = copy[higherIndex];

    // switch values
    copy[oldIndex] = upperValue;
    copy[higherIndex] = oldValue;

    return copy;
};

export const moveToLastPosition = (array, name) => {
    const copy = [...array];
    const [oldValue] = copy.splice(copy.indexOf(name), 1);

    copy.push(oldValue);

    return copy;
};

export const moveToFirstPosition = (array, name) => {
    const copy = [...array];
    const [oldValue] = copy.splice(copy.indexOf(name), 1);

    copy.unshift(oldValue);

    return copy;
};

export const moveRight = (array, name, toLastPosition) => {
    if (toLastPosition) {
        return moveToLastPosition(array, name);
    }

    return moveOneRight(array, name);
};

export const moveLeft = (array, name, toFirstPositioin) => {
    if (toFirstPositioin) {
        return moveToFirstPosition(array, name);
    }

    return moveOneLeft(array, name);
};

/**
 * @param arrayOfNumbers - takes an array of numbers
 * @param number {Number} - takes any number
 * @returns {Number} - returns closest number from the array according to the passed one
 */
export const getClosestNumberInArray = (arrayOfNumbers, number) => (
    arrayOfNumbers.sort((a, b) => Math.abs(number - a) - Math.abs(number - b))
)[0];

export const getMaxArrayValue = (array) => Math.max(...array);

export const getMinArrayValue = (array) => Math.min(...array);