/**
 * Fits element to container based on coordinates
 * @param {DOMElement} element
 * @param {DOMElement} container
 * @param {Object} coordinates
 */
export const fitElementToContainer = (element, container, coordinates) => {
    if (!element || !container) {
        return {
            left: container.left,
            top: container.top,
        };
    }

    const {
        left: coordinatesLeft,
        top: coordinatesTop,
    } = coordinates;

    const {
        width: elementWidth,
        height: elementHeight,
    } = element.getBoundingClientRect();

    const {
        height: containerHeight,
        width: containerWidth,
    } = container.getBoundingClientRect();

    let {
        left,
        top,
    } = coordinates;

    // Open to left
    if (coordinatesLeft + elementWidth > containerWidth) {
        left -= elementWidth;
    }

    // Open to top
    if (coordinatesTop + elementHeight > containerHeight) {
        top -= elementWidth;
    }

    return {
        left,
        top,
    };
};