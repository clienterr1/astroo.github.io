import {
    DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE
} from '@zyro-inc/site-modules/constants';

/**
 * Select layout elements in DOM and return their positions, type and ID
 * @param {Array} elementTypes - Array of element types to select
 * @param {Boolean} shouldAccountForScrollPosition - wether scroll position should be accounted for
 * @returns {Array} Array of objects with element id, type and position
 */
export const getLayoutElementsPositionsInDom = ({
    elementTypes = [],
    shouldAccountForScrollPosition = false,
}) => {
    const elementsPositionsQuery = elementTypes.map((elementType) => `[${DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE}="${elementType}"]`).join(', ');

    if (!elementsPositionsQuery) {
        return [];
    }

    const elementsPositions = [...document.querySelectorAll(elementsPositionsQuery)].map((element) => {
        const {
            top,
            left,
            height,
            width,
        } = element.getBoundingClientRect();

        return {
            id: element.id,
            elementType: element.dataset.elementType,
            position: {
                top: shouldAccountForScrollPosition ? top + window.scrollY : top,
                left: shouldAccountForScrollPosition ? left + window.scrollX : left,
                height,
                width,
            },
        };
    });

    return elementsPositions;
};