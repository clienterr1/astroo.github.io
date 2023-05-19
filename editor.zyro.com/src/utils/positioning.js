// Returns the coordinates of the element and adds page offset.
const getCoords = ({
    top,
    left,
    isAbsolute = false,
}) => ({
    top: `${isAbsolute ? top + window.pageYOffset : top}px`,
    left: `${isAbsolute ? left + window.pageXOffset : left}px`,
});

export const isWithinScreen = (element) => {
    // counts from header bottom, not actual screen top
    const headerHeight = 50;
    const {
        top,
        left,
        bottom,
        right,
    } = element.getBoundingClientRect();

    return (
        top >= headerHeight &&
        left >= 0 &&
        bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const getDistanceToScreenBottom = (element) => {
    const {
        bottom
    } = element.getBoundingClientRect();
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight);

    return viewportHeight - bottom;
};

export default {
    positionElemPopupDesktop(element, viewport, popup, returnUnit = true) {
        const {
            top: elementTop,
            left: elementLeft,
            right: elementRight,
            height: elementHeight,
            width: elementWidth,
            bottom: elementBottom,
        } = element.getBoundingClientRect();

        const {
            top: viewportTop,
            right: viewportRight,
        } = viewport.getBoundingClientRect();

        const {
            height: popupHeight,
            width: popupWidth,
        } = popup.getBoundingClientRect();

        const sidebarWidth = 60;
        const headerHeight = 60;
        const visiblePartOfScreen = (window.innerHeight || document.documentElement.clientHeight);
        let top = elementTop + (elementHeight / 2) - popupHeight / 2 - viewportTop + viewport.scrollTop;
        let left = elementRight + 40;

        // if there is too little space on right, popup appears on left
        if (left + popupWidth > viewportRight - sidebarWidth) {
            left = elementLeft - popupWidth - 30;
        }

        // if popup and elem do not fit horizontally, popup appears on elem
        if (left < 0) {
            left = elementLeft + elementWidth / 2 - popupWidth / 2;
        }

        // if elem is by page top, popup top lines up with elem top
        if (isWithinScreen(element) && elementTop < popupHeight / 2) {
            top += popupHeight / 2 - elementHeight / 2;
        }

        // if elem is by page bottom, popup bottom lines up with elem bottom
        if (isWithinScreen(element) && getDistanceToScreenBottom(element) < popupHeight / 2) {
            top -= popupHeight / 2 - elementHeight / 2;
        }

        if (!isWithinScreen(element)) {
            // if part of elem is outside screen, popup appears in y-axis center
            top = window.scrollY + visiblePartOfScreen / 2 -
                popupHeight / 2;

            const defineLeft = () => {
                // if elem by left screen side, popup moves a bit to right to be fully visible
                if (window.innerWidth - elementRight - sidebarWidth < (popupWidth - elementWidth) / 2 &&
                    elementWidth < popupWidth) {
                    left = elementRight - popupWidth;
                    // if elem by right screen side, popup moves a bit to left to be fully visible
                } else if (window.innerWidth - (window.innerWidth - elementLeft) <
                    (popupWidth - elementWidth) / 2 &&
                    elementWidth < popupWidth) {
                    left = elementLeft;
                }

                return left;
            };

            // if elem crosses screen bottom, popup appears above elem if it fits vertically
            if (elementTop - headerHeight - 30 > popupHeight) {
                top = elementTop - popupHeight - viewportTop + viewport.scrollTop - 30;
                left = elementLeft + elementWidth / 2 - popupWidth / 2;

                left = defineLeft();
            }

            // if elem crosses screen top, popup appears under elem if it fits vertically
            if (elementTop < 0 && (visiblePartOfScreen - elementBottom) > popupHeight + headerHeight) {
                const visiblePartOfElement = elementHeight + elementTop;

                top = window.scrollY + visiblePartOfElement + 20;
                left = elementLeft + elementWidth / 2 - popupWidth / 2;

                left = defineLeft();
            }
        }

        return {
            top: returnUnit ? `${top}px` : top,
            left: returnUnit ? `${left}px` : left,
        };
    },

    // Gets element offset in viewport
    getElementOffset(element, viewport) {
        const elementOffset = element.getBoundingClientRect();
        const viewportOffset = viewport.getBoundingClientRect();

        const top = elementOffset.top + viewport.scrollTop - viewportOffset.top;

        return {
            top,
            right: 0,
            left: 0,
            height: elementOffset.height,
        };
    },
    bottom(baseElement, elementToPosition, isAbsolute, margin = 20) {
        const baseElementOffset = baseElement.getBoundingClientRect();
        const elementToPositionOffset = elementToPosition.getBoundingClientRect();

        const top = baseElementOffset.bottom + margin;
        const left = baseElementOffset.width < elementToPositionOffset.width ?
            baseElementOffset.left - ((elementToPositionOffset.width - baseElementOffset.width) / 2) :
            baseElementOffset.right - ((baseElementOffset.width + elementToPositionOffset.width) / 2);

        return getCoords({
            top,
            left,
            isAbsolute,
        });
    },
    top(baseElement, elementToPosition, isAbsolute, viewport, margin = 20) {
        const baseElementOffset = baseElement.getBoundingClientRect();
        const elementToPositionOffset = elementToPosition.getBoundingClientRect();

        const top = baseElementOffset.top - margin;
        const left = baseElementOffset.width < elementToPositionOffset.width ?
            baseElementOffset.left - ((elementToPositionOffset.width - baseElementOffset.width) / 2) :
            baseElementOffset.right - ((baseElementOffset.width + elementToPositionOffset.width) / 2);

        if (viewport) {
            const viewportOffset = viewport.getBoundingClientRect();

            return getCoords({
                top: top - viewportOffset.top + viewport.scrollTop,
                left,
                isAbsolute,
            });
        }

        return getCoords({
            top,
            left,
            isAbsolute,
        });
    },
    right(baseElement, elementToPosition, isAbsolute, margin = 15) {
        const baseElementOffset = baseElement.getBoundingClientRect();
        const elementToPositionOffset = elementToPosition.getBoundingClientRect();

        const left = baseElementOffset.right + margin;
        const top = baseElementOffset.height < elementToPositionOffset.height ?
            baseElementOffset.top - ((elementToPositionOffset.height - baseElementOffset.height) / 2) :
            baseElementOffset.left - ((baseElementOffset.height + elementToPositionOffset.height) / 2);

        return getCoords({
            top,
            left,
            isAbsolute,
        });
    },
    rightTop(baseElement, elementToPosition, isAbsolute, margin = 6) {
        const baseElementOffset = baseElement.getBoundingClientRect();

        const left = baseElementOffset.right + margin;
        const {
            top
        } = baseElementOffset;

        return getCoords({
            top,
            left,
            isAbsolute,
        });
    },
    leftTop(baseElement, elementToPosition, isAbsolute, margin = 6) {
        const baseElementOffset = baseElement.getBoundingClientRect();
        const elementToPositionOffset = elementToPosition.getBoundingClientRect();

        const left = baseElementOffset.right - margin - elementToPositionOffset.width;
        const {
            top
        } = baseElementOffset;

        return getCoords({
            top,
            left,
            isAbsolute,
        });
    },
};