// Get element position from dom relative to grid block
export const getElementPositionFromDOM = ({
    elementId,
    blockId,
    leftOffset = 0,
}) => {
    const elementRect = document.querySelector(`[data-element-ref='${elementId}']`).getBoundingClientRect();
    const blockRect = document.querySelector(`[data-block-ref='${blockId}']`).getBoundingClientRect();

    const elementRectOffsetFromBlockRect = {
        top: Math.round(elementRect.top - blockRect.top),
        left: Math.round(elementRect.left - blockRect.left - leftOffset),
        width: Math.round(elementRect.width),
        height: Math.round(elementRect.height),
    };

    return elementRectOffsetFromBlockRect;
};