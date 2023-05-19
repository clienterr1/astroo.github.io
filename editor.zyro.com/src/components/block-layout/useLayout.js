import {
    watch,
    computed,
    ref,
    nextTick,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    DESKTOP_BLOCK_WIDTH,
    ELEMENT_TYPE_TEXT_BOX,
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
    RESIZABLE_WIDTH_ELEMENT_TYPES,
    RESIZABLE_HEIGHT_ELEMENT_TYPES,
    DEFAULT_SECTION_ROW_HEIGHT,
    DEFAULT_SECTION_ROW_GAP,
    DEFAULT_SNAP_TO_ELEMENTS,
    DEFAULT_SNAP_TO_GUIDES,
} from '@zyro-inc/site-modules/constants';

import {
    MOBILE_BLOCK_PADDING_X,
    MOBILE_BUILDER_WIDTH,
    DEFAULT_COLUMN_GAP,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';
import {
    useBlockLayout
} from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';
import {
    useElementsRefs
} from '@/use/useElementsRefs';

import {
    LAYOUT_SNAP_THRESHOLD_X,
    LAYOUT_SNAP_THRESHOLD_Y,
    LAYOUT_SNAP_TYPES,
    LAYOUT_ELEMENT_MAX_HEIGHT,
    LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT,
    LAYOUT_ELEMENT_DEFAULT_MIN_WIDTH,
    LAYOUT_ELEMENT_RESIZE_DIRECTIONS,
    LAYOUT_ELEMENT_MINIMUM_WIDTHS,
} from '@/constants';
import {
    getElementPositionFromDOM
} from '@/components/block-layout/getElementPositionFromDom';
import {
    useDrag
} from '@/use/useDrag';
import {
    useAddElement
} from '@/use/useAddElement';
import {
    useMultiSelect
} from '@/use/useMultiSelect';
import {
    blockHeightOnResize,
    resizedSectionId,
    useSectionResizing,
} from '@/use/useSectionResizing';

export const fitToLayoutXBounds = (position, blockWidth) => {
    const {
        left,
        width,
        top,
        height,
    } = position;

    return {
        top,
        // Override left lesser than 0 and greater than block width - element width
        left: Math.min(Math.max(0, left), Math.max(0, blockWidth - width)),
        height,
        width: Math.min(width, blockWidth),
    };
};

export const fitToLayoutYBounds = (position) => {
    const {
        left,
        width,
        top,
        height,
    } = position;

    return {
        // Don't allow the block to go outside the layout bounds
        top: Math.max(0, top),
        left,
        height,
        width,
    };
};

export const getMinimumElementWidth = (elementType) => LAYOUT_ELEMENT_MINIMUM_WIDTHS[elementType] || LAYOUT_ELEMENT_DEFAULT_MIN_WIDTH;
export const findClosest = (value, valueArray) => valueArray
    .reduce((prev, curr) => (Math.abs(curr - value) <= Math.abs(prev - value) ? curr : prev), null);

export const findClosestSnapPoint = (value, valueArray) => {
    // Store diffs for each value in the array
    const diffs = valueArray.map((x) => Math.abs(value - x.location));
    // Get the smallest difference
    const minNumber = Math.min(...diffs);
    // Find index of that smallest difference
    const index = diffs.findIndex((x) => x === minNumber);

    return valueArray[index];
};

export const updateElementPositionFromDOM = ({
    elementId,
    blockId,
    dispatch,
    isMobileMode,
    pushToHistory = true,
}) => {
    const blockWidth = isMobileMode ? MOBILE_BUILDER_WIDTH : DESKTOP_BLOCK_WIDTH;
    const elementPositionKey = isMobileMode ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP;

    const position = fitToLayoutXBounds(
        getElementPositionFromDOM({
            elementId,
            blockId,
            leftOffset: isMobileMode ? MOBILE_BLOCK_PADDING_X : 0,
        }),
        blockWidth,
    );

    dispatch('mergeElementData', {
        elementId,
        elementData: {
            [elementPositionKey]: position,
            shouldUpdateElementPosition: null,
        },
        pushToHistory,
    });
};

export const getMultiSelectedElementsPositions = ({
    multiSelectAreaPosition,
    draggedElementsSnapPosition,
    shouldFitToLayoutYBounds,
    multiSelectedElements,
    elementPositionKey,
    blockWidth,
}) => {
    const {
        top: initialTop,
        left: initialLeft,
    } = multiSelectAreaPosition;

    const {
        top,
        left,
    } = shouldFitToLayoutYBounds ? fitToLayoutYBounds(draggedElementsSnapPosition) : draggedElementsSnapPosition;

    const topOffset = initialTop - top;
    const leftOffset = initialLeft - left;

    return Object.fromEntries(Object.entries(multiSelectedElements).map(([, element]) => {
        const {
            top: elementTop,
            left: elementLeft,
            height: elementHeight,
            width: elementWidth,
        } = element[elementPositionKey];

        const position = fitToLayoutXBounds({
            height: elementHeight,
            width: elementWidth,
            left: elementLeft - leftOffset,
            top: elementTop - topOffset,
        }, blockWidth);

        return [
            element.elementId,
            position,
        ];
    }));
};

export const getElementsBellowActiveElementPositions = ({
    initialElementPosition,
    draggedElementSnapPosition,
    elementPositionKey,
    lowerElementsRelativeToActive,
}) => {
    const {
        top: initialTop
    } = initialElementPosition;

    const {
        top
    } = fitToLayoutYBounds(draggedElementSnapPosition);

    const topOffset = initialTop - top;

    return Object.fromEntries(Object.entries(lowerElementsRelativeToActive).map(([, element]) => {
        const {
            top: elementTop,
            left: elementLeft,
            height: elementHeight,
            width: elementWidth,
        } = element[elementPositionKey];

        const position = {
            height: elementHeight,
            width: elementWidth,
            left: elementLeft,
            top: elementTop - topOffset,
        };

        return [
            element.elementId,
            position,
        ];
    }));
};

const isViewingLayoutSettings = ref(false);

export const useLayout = (props, context) => {
    const {
        getters,
        dispatch,
    } = useStore();
    // Vuex bindings
    // TODO: only blockElements from props should be relevant:
    const siteElements = computed(() => props.components);
    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const currentElementBlockId = computed(() => getters.currentElementBlockId);
    const hoveredBlockId = computed(() => props.hoveredBlock ? .id);
    const hoveredBlockType = computed(() => props.hoveredBlock ? .type);
    const addElementData = computed(() => getters.addElementData);
    const blockData = computed(() => props.data);
    const blockLayoutRef = ref();
    const blockHeightWhileSpacingIsChanged = ref(null);
    const gapBetweenLastElementAndBlockHeight = ref(0);

    // Composables
    const {
        layoutElements,
        layoutCSSVars,
        buildResponsiveGrid,
        isMobileLegacy,
    } = useBlockLayout({
        blockData,
        siteElements,
        shouldBuildResponsive: false,
    });

    const {
        isElementVisibleOnScreen
    } = useElementsRefs();

    const {
        addLayoutElement
    } = useAddElement();

    const {
        startDragging,
        hasMouseMoved,
        mouseDeltaX,
        mouseDeltaY,
        isDragging,
    } = useDrag();

    const {
        isMultiSelecting,
        isMultiSelectActive,
        multiSelectedElements,
        multiSelectedElementsIds,
        multiSelectedBlockId,
        startSelection,
        updateSelection,
        endSelection,
        resetMultiSelection,
        updateMultiSelectedElements,
        dragBoxPosition,
        multiSelectAreaPosition,
    } = useMultiSelect();

    const {
        saveBlockMinHeight
    } = useSectionResizing(props);

    // State refs
    const draggedElementId = ref();
    const resizedElementId = ref();
    const resizedDirection = ref();
    const isMovingElementsBellow = ref(false);

    const isDraggingElement = computed(() => !!draggedElementId.value);

    const draggedElementBlockId = computed(() => (isMultiSelectActive.value ? multiSelectedBlockId.value : currentElementBlockId.value));

    // Computed properties
    // Returns either the dragged element or the resized element
    const activeElementId = computed(() => resizedElementId.value ? ? draggedElementId.value);
    const activeElementData = computed(() => layoutElements.value.find(({
        elementId
    }) => elementId === activeElementId.value));

    const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

    const lowerElementsRelativeToActive = computed(() => {
        if (!isMovingElementsBellow.value) {
            return [];
        }

        return layoutElements.value
            .filter((element) => {
                const isNotActiveElement = element.elementId !== activeElementId.value;
                const isBellowActiveElement = activeElementData.value[elementPositionKey.value].top <=
                    element[elementPositionKey.value].top;

                return isNotActiveElement && isBellowActiveElement;
            });
    });
    const lowerElementsIdsRelativeToActive = computed(() => lowerElementsRelativeToActive.value.map(({
        elementId
    }) => elementId));
    const lowestElementRelativeToActiveId = computed(() => lowerElementsRelativeToActive.value.sort((firstElement, secondElement) => {
        const {
            top: firstElementTop,
            height: firstElementHeight,
        } = firstElement[elementPositionKey.value];
        const {
            top: secondElementTop,
            height: secondElementHeight,
        } = secondElement[elementPositionKey.value];
        const firstElementBottom = firstElementTop + firstElementHeight || 0;
        const secondElementBottom = secondElementTop + secondElementHeight || 0;

        return secondElementBottom - firstElementBottom;
    })[0] ? .elementId || null);

    const higherElementsRelativeToActive = computed(() => {
        if (!isMovingElementsBellow.value) {
            return [];
        }

        return layoutElements.value
            .filter((element) => {
                const isNotActiveElement = element.elementId !== activeElementId.value;

                const {
                    top: activeElementTop,
                    height: activeElementHeight,
                } = activeElementData.value[elementPositionKey.value];

                const {
                    top: elementTop,
                    height: elementHeight,
                } = element[elementPositionKey.value];

                const activeElementBottom = activeElementTop + activeElementHeight;
                const elementBottom = elementTop + elementHeight;

                const isAboveActiveElement = activeElementBottom > elementBottom;

                return isNotActiveElement && isAboveActiveElement;
            });
    });
    const highestElementRelativeToActive = computed(() => higherElementsRelativeToActive.value.sort((firstElement, secondElement) => {
        const {
            top: firstElementTop,
            height: firstElementHeight,
        } = firstElement[elementPositionKey.value];
        const {
            top: secondElementTop,
            height: secondElementHeight,
        } = secondElement[elementPositionKey.value];
        const firstElementBottom = firstElementTop + firstElementHeight || 0;
        const secondElementBottom = secondElementTop + secondElementHeight || 0;

        return secondElementBottom - firstElementBottom;
    })[0] || {});
    const highestElementRelativeToActiveId = computed(() => highestElementRelativeToActive.value ? .elementId);
    const highestElementRelativeToActivePosition = computed(() => highestElementRelativeToActive.value ? .[elementPositionKey.value] || {});
    const highestElementRelativeToActiveBottom = computed(() => {
        const {
            top: highestElementTop,
            height: highestElementHeight,
        } = highestElementRelativeToActivePosition.value;

        return highestElementTop + highestElementHeight;
    });

    const snapRowHeight = computed(() => blockData.value.snapRowHeight || DEFAULT_SECTION_ROW_HEIGHT);
    const snapRowGap = computed(() => blockData.value.snapRowGap || DEFAULT_SECTION_ROW_GAP);
    const shouldSnapToElements = computed(() => ('shouldSnapToElements' in blockData.value ?
        blockData.value.shouldSnapToElements :
        DEFAULT_SNAP_TO_ELEMENTS));
    const shouldSnapToGuides = computed(() => ('shouldSnapToGuides' in blockData.value ?
        blockData.value.shouldSnapToGuides :
        DEFAULT_SNAP_TO_GUIDES));

    // Returns initial element position of dragged or resized element (before interactions)
    // Throws error if activeElementId.value is undefined because it tries to read position properties
    const initialElementPosition = computed(() => {
        if (isMultiSelectActive.value) {
            return multiSelectAreaPosition.value;
        }

        const activeElement = layoutElements.value
            .find(({
                elementId
            }) => elementId === activeElementId.value);

        return activeElement ? .[elementPositionKey.value] || {};
    });

    // Returns remapped snap data of all the elements snap data (position, center, right etc)
    // (excluding the dragged or resized element)
    const elementsSnapData = computed(() => {
        if (!shouldSnapToElements.value) {
            return [];
        }

        return layoutElements.value
            .filter(({
                elementId
            }) => elementId !== activeElementId.value)
            .map((element) => {
                const {
                    left,
                    top,
                    width,
                    height,
                } = element[elementPositionKey.value];

                return {
                    ...element[elementPositionKey.value],
                    elementId: element.elementId,
                    right: left + width,
                    bottom: top + height,
                    centerX: Math.round(left + width / 2),
                    centerY: Math.round(top + height / 2),
                };
            });
    });

    /**
     * Returns snap data of only those elements that are visible on screen
     * isElementVisibleOnScreen is not really reactive, but since elementsSnapData depends on activeElementId it is
     * recalculated each time you start dragging or resizing an element
     */
    const visibleElementsSnapData = computed(() => elementsSnapData.value.filter(({
        elementId
    }) => isElementVisibleOnScreen(elementId)));

    // Returns block and it's columns sizes
    const blockWidth = computed(() => (isMobileMode.value ? MOBILE_BUILDER_WIDTH : DESKTOP_BLOCK_WIDTH));
    const desktopBlockHeight = computed(() => blockData.value.desktop.minHeight);
    const mobileBlockHeight = computed(() => blockData.value.mobile.minHeight);

    const blockHeight = computed(() => {
        if (props.blockId === resizedSectionId.value && blockHeightWhileSpacingIsChanged.value) {
            return blockHeightWhileSpacingIsChanged.value;
        }

        return isMobileMode.value ? mobileBlockHeight.value : desktopBlockHeight.value;
    });
    const blockCenter = computed(() => blockWidth.value / 2);
    const columnCount = computed(() => (isMobileMode.value ? 2 : 12));
    // 24 row height 16 row gap
    const rowCount = computed(() => Math.round(blockHeight.value / (snapRowHeight.value + snapRowGap.value)));

    const columnWidth = computed(() => {
        const gapsWidth = (columnCount.value - 1) * DEFAULT_COLUMN_GAP;

        return (blockWidth.value - gapsWidth) / columnCount.value;
    });

    // Returns left and rights sides of the columns
    const columnsLefts = computed(() => [...Array(columnCount.value)]
        .map((_, index) => index * (columnWidth.value + DEFAULT_COLUMN_GAP)));
    const columnsRights = computed(() => columnsLefts.value.map((left) => left + columnWidth.value));
    const rowTops = computed(() => [...Array(rowCount.value)]
        .map((_, index) => Math.floor(index * (snapRowHeight.value + snapRowGap.value))));
    const rowBottoms = computed(() => [...Array(rowCount.value)]
        .map((_, index) => Math.floor((index * (snapRowHeight.value + snapRowGap.value)) + snapRowHeight.value)));
    // Returns resize direction of the resized element as booleans
    // Used to adjust width/height when dragged to left/top side of the element
    // TODO: maybe computeds are not needed
    const isResizingLeft = computed(() => [
        'left',
        'bottom-left',
        'top-left',
    ].includes(resizedDirection.value));

    const isResizingRight = computed(() => [
        'right',
        'bottom-right',
        'top-right',
    ].includes(resizedDirection.value));

    const isResizingTop = computed(() => [
        'top',
        'top-left',
        'top-right',
    ].includes(resizedDirection.value));

    const isResizingTopCorners = computed(() => [
        'top-left',
        'top-right',
    ].includes(resizedDirection.value));

    const isResizingBottom = computed(() => [
        'bottom',
        'bottom-left',
        'bottom-right',
    ].includes(resizedDirection.value));

    const isResizingBottomCorners = computed(() => [
        'bottom-left',
        'bottom-right',
    ].includes(resizedDirection.value));

    const isResizingWidthAndHeight = computed(() => [
        'bottom-left',
        'bottom-right',
        'top-left',
        'top-right',
    ].includes(resizedDirection.value));

    const isResizingWidth = computed(() => [
        'left',
        'right',
    ].includes(resizedDirection.value));

    const isResizingHeight = computed(() => [
        'top',
        'bottom',
    ].includes(resizedDirection.value));

    // #region Drag snapping
    // Returns dynamic element position while dragging from mouse deltas and fits it to layout bounds
    const draggedElementPosition = computed(() => {
        const {
            width,
            height,
            left,
            top,
        } = initialElementPosition.value;

        // Don't change left position while using spacing between elements.
        // Only changing elements top position is available while using spacing between elements
        const draggedLeft = isMovingElementsBellow.value ? left : left + mouseDeltaX.value;
        const draggedTop = top + mouseDeltaY.value;

        if (isMovingElementsBellow.value) {
            // Don't allow to drag element while changing spacing above higher element
            // Check if initial dragged element is fully bellow highest element
            if (
                draggedTop <= highestElementRelativeToActiveBottom.value &&
                top >= highestElementRelativeToActiveBottom.value
            ) {
                return fitToLayoutXBounds({
                    height,
                    width,
                    left: draggedLeft,
                    top: highestElementRelativeToActiveBottom.value,
                }, blockWidth.value);
            }

            // Don't allow to drag element outside the blocks top bounds
            if (draggedTop <= 0) {
                return fitToLayoutXBounds({
                    height,
                    width,
                    left: draggedLeft,
                    top: 0,
                }, blockWidth.value);
            }
        }

        return fitToLayoutXBounds({
            height,
            width,
            left: draggedLeft,
            top: draggedTop,
        }, blockWidth.value);
    });

    const isBlockHeightChanging = computed(() => draggedElementPosition.value.top === highestElementRelativeToActiveBottom.value);

    const sectionResizeBlockingElementId = computed(() => {
        if (!isMovingElementsBellow.value || !isBlockHeightChanging.value) {
            return null;
        }

        return highestElementRelativeToActiveId.value;
    });
    const isElementMovedToOtherBlock = computed(() => {
        // Prevents edge cases when you drag element and the scroll page your hoveredBlockId
        // is wrong and you update store with wrong block id
        const isValidElementMoveToOtherBlock = hoveredBlockType.value === 'BlockLayout' &&
            draggedElementBlockId.value &&
            hoveredBlockId.value &&
            draggedElementBlockId.value !== hoveredBlockId.value &&
            !isMovingElementsBellow.value; // Prevents moving elements to other blocks while changing spacing between elements

        if (!isValidElementMoveToOtherBlock) {
            return false;
        }

        const shouldMoveToAboveBlock = draggedElementPosition.value.top < 0;

        return shouldMoveToAboveBlock ?
            Math.abs(draggedElementPosition.value.top) > draggedElementPosition.value.height :
            draggedElementPosition.value.top > desktopBlockHeight.value;
    });

    const columnsXSnapPoints = computed(() => {
        const columnLeftPoints = columnsLefts.value.map((location) => ({
            snapsTo: ['left'],
            location,
            type: LAYOUT_SNAP_TYPES.COLUMN,
        }));

        const columnRightPoints = columnsRights.value.map((location) => ({
            snapsTo: ['right'],
            location,
            type: LAYOUT_SNAP_TYPES.COLUMN,
        }));

        const allPoints = [
            ...columnLeftPoints,
            ...columnRightPoints,
        ];

        // Find only unique locations
        const uniqueLocations = [...new Set(allPoints.map(({
            location
        }) => location))];

        // Return unique points
        return uniqueLocations.map((location) => allPoints.find((point) => point.location === location));
    });

    // Returns all the horizontal (X) guides from all the elements and columns in a single flat array
    const elementsXSnapPoints = computed(() => {
        const elementCenterXPoints = visibleElementsSnapData.value.reduce((prev, {
            top,
            centerX,
            bottom,
        }) => ([
            ...prev,
            {
                location: centerX,
                snapsTo: ['center'],
                type: LAYOUT_SNAP_TYPES.ELEMENT_CENTER,
                top,
                bottom,
            },
        ]), []);

        // Add center first so its display is prioritized
        const allPoints = [{
                snapsTo: [
                    'left',
                    'right',
                    'center',
                ],
                location: blockCenter.value,
                type: LAYOUT_SNAP_TYPES.BLOCK_CENTER,
            },
            ...elementCenterXPoints,
        ];

        // Find only unique locations
        const uniqueLocations = [...new Set(allPoints.map(({
            location
        }) => location))];

        // Return unique points
        return uniqueLocations.map((location) => allPoints.find((point) => point.location === location));
    });

    const allSnapXPoints = computed(() => {
        if (shouldSnapToElements.value && shouldSnapToGuides.value) {
            return [
                ...columnsXSnapPoints.value,
                ...elementsXSnapPoints.value,
            ];
        }

        if (shouldSnapToElements.value) {
            return [...elementsXSnapPoints.value];
        }

        if (shouldSnapToGuides.value) {
            return [...columnsXSnapPoints.value];
        }

        return [];
    });

    // Returns all the vertical (Y) guides from all the rows in a single array.
    const rowsYSnapPoints = computed(() => {
        const rowTopPoints = rowTops.value.map((location) => ({
            snapsTo: ['top'],
            location,
            type: LAYOUT_SNAP_TYPES.ROW,
        }));

        const rowBottomPoints = rowBottoms.value.map((location) => ({
            snapsTo: ['bottom'],
            location,
            type: LAYOUT_SNAP_TYPES.ROW,
        }));

        const allPoints = [
            ...rowTopPoints,
            ...rowBottomPoints,
        ];

        const uniqueLocations = [...new Set(allPoints.map(({
            location
        }) => location))];

        // Return unique points
        return uniqueLocations.map((location) => allPoints.find((point) => point.location === location));
    });

    const elementsYSnapPoints = computed(() => {
        const elementYSnapPoints = visibleElementsSnapData.value.reduce((prev, {
            top,
            centerY,
            bottom,
            left,
            right,
        }) => ([
            ...prev,
            {
                location: top,
                type: LAYOUT_SNAP_TYPES.ELEMENT_EDGE,
                snapsTo: ['left, right'],
                left,
                right,
            },
            {
                location: centerY,
                type: LAYOUT_SNAP_TYPES.ELEMENT_CENTER,
                snapsTo: ['left, right'],
                left,
                right,
            },
            {
                location: bottom,
                type: LAYOUT_SNAP_TYPES.ELEMENT_EDGE,
                snapsTo: ['left, right'],
                left,
                right,
                bottom,
            },
        ]), []);

        const allPoints = [...elementYSnapPoints];

        const uniqueLocations = [...new Set(allPoints.map(({
            location
        }) => location))];

        // Return unique points
        return uniqueLocations.map((location) => allPoints.find((point) => point.location === location));
    });

    const allSnapYPoints = computed(() => {
        if (shouldSnapToElements.value && shouldSnapToGuides.value) {
            return [
                ...elementsYSnapPoints.value,
                ...rowsYSnapPoints.value,
            ];
        }

        if (shouldSnapToElements.value) {
            return [...elementsYSnapPoints.value];
        }

        if (shouldSnapToGuides.value) {
            return [...rowsYSnapPoints.value];
        }

        return [];
    });

    // Points where element left snaps to when dragged
    const leftDragSnapLocations = computed(() => allSnapXPoints.value
        .filter((point) => point.snapsTo.includes('left'))
        .map(({
            location
        }) => location));

    // Points where element centerX snaps to when dragged
    const centerXDragSnapLocations = computed(() => allSnapXPoints.value
        .filter((point) => point.snapsTo.includes('center'))
        .map(({
            location
        }) => location));

    // Points where element right snaps to when dragged
    const rightDragSnapLocations = computed(() => allSnapXPoints.value
        .filter((point) => point.snapsTo.includes('right'))
        .map(({
            location
        }) => location));

    // Returns dragged element left snapping point if element was snapped by x axis
    const draggedElementSnapPositionLeft = computed(() => {
        const {
            left,
            width,
        } = draggedElementPosition.value;

        const closestLeft = findClosest(left, leftDragSnapLocations.value);
        const distanceToLeft = Math.abs(left - closestLeft);

        const closestRight = findClosest(left + width, rightDragSnapLocations.value);
        const distanceToRight = Math.abs((left + width) - closestRight);

        const closestCenterX = findClosest(Math.round(left + width / 2), centerXDragSnapLocations.value);
        const distanceToCenterX = Math.abs((Math.round(left + width / 2)) - closestCenterX);

        const smallestDistanceToX = Math.min(
            distanceToLeft,
            distanceToCenterX,
            distanceToRight,
        );

        if (smallestDistanceToX > LAYOUT_SNAP_THRESHOLD_X) {
            return null;
        }

        if (smallestDistanceToX === distanceToLeft) {
            return closestLeft;
        }

        if (smallestDistanceToX === distanceToRight) {
            return closestRight - width;
        }

        if (smallestDistanceToX === distanceToCenterX) {
            return closestCenterX - width / 2;
        }

        return null;
    });

    // Points where element top/centerY/bottom snaps to when dragged
    // We could just pass elementsYSnapPoints, but this is clearer and will be easier to add to
    const yDragSnapLocations = computed(() => allSnapYPoints.value.map(({
        location
    }) => location));
    const yDragAvailableCenterSnapPoints = computed(() => elementsYSnapPoints.value.map(({
        location
    }) => location));

    // Returns dragged element top snapping point if element was snapped by y axis
    const draggedElementSnapPositionTop = computed(() => {
        const {
            height,
            top,
        } = draggedElementPosition.value;

        const closestTop = findClosest(top, yDragSnapLocations.value);
        const distanceToTop = Math.abs(top - closestTop);

        const closestCenterYHorizontal = findClosest(Math.round(top + height / 2), yDragAvailableCenterSnapPoints.value);
        const distanceToCenterYHorizontal = Math.abs(
            (Math.round(top + height / 2)) - closestCenterYHorizontal,
        );

        const closestBottom = findClosest(top + height, yDragSnapLocations.value);
        const distanceToBottom = Math.abs((top + height) - closestBottom);

        const smallestDistanceToY = Math.min(
            distanceToTop,
            distanceToCenterYHorizontal,
            distanceToBottom,
        );

        if (smallestDistanceToY > LAYOUT_SNAP_THRESHOLD_Y) {
            return null;
        }

        if (smallestDistanceToY === distanceToTop) {
            return closestTop;
        }

        if (smallestDistanceToY === distanceToCenterYHorizontal) {
            return closestCenterYHorizontal - height / 2;
        }

        if (smallestDistanceToY === distanceToBottom) {
            return closestBottom - height;
        }

        return null;
    });

    // Returns draggedElementPosition with the whole position snapped to snap points, fits it to layout bounds
    const draggedElementSnapPosition = computed(() => {
        const {
            height,
            width,
            left,
            top,
        } = draggedElementPosition.value;

        return fitToLayoutXBounds({
            left: draggedElementSnapPositionLeft.value ? ? left,
            top: draggedElementSnapPositionTop.value ? ? top,
            width,
            height,
        }, blockWidth.value);
    });

    // #endregion

    // #region Resize snapping

    // Returns dynamic element position while resizing from mouse deltas and fits it to layout bounds
    const resizedElementPosition = computed(() => {
        const {
            top,
            left,
            width,
            height,
        } = initialElementPosition.value;

        const getResizedWidthPosition = () => {
            const maxElementWidth = isResizingLeft.value ?
                left + width :
                blockWidth.value - left;

            const resizedWidth = isResizingLeft.value ?
                Math.round(width - mouseDeltaX.value) :
                Math.round(width + mouseDeltaX.value);

            const limitedWidth = Math.max(
                Math.min(
                    resizedWidth,
                    maxElementWidth,
                ),
                getMinimumElementWidth(activeElementData.value.type),
            );

            const resizedLeft = isResizingLeft.value ?
                left + (width - limitedWidth) :
                left;

            return fitToLayoutXBounds({
                left: resizedLeft,
                width: limitedWidth,
                height,
                top,
            }, blockWidth.value);
        };

        const getResizedHeightPosition = () => {
            const maxElementHeight = isResizingTop.value ?
                top + height :
                LAYOUT_ELEMENT_MAX_HEIGHT;

            const resizedHeight = isResizingTop.value ?
                Math.ceil(height - mouseDeltaY.value) :
                Math.ceil(height + mouseDeltaY.value);

            const limitedHeight = Math.max(
                Math.min(
                    resizedHeight,
                    maxElementHeight,
                ),
                LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT,
            );

            const resizedTop = isResizingTop.value ?
                top + (height - limitedHeight) :
                top;

            return fitToLayoutXBounds({
                left,
                width,
                height: limitedHeight,
                top: resizedTop,
            }, blockWidth.value);
        };

        if (isResizingWidthAndHeight.value) {
            const resizedHeight = getResizedHeightPosition();

            const resizedWidth = getResizedWidthPosition();

            return {
                top: resizedHeight.top,
                left: resizedWidth.left,
                width: resizedWidth.width,
                height: resizedHeight.height,
            };
        }

        if (isResizingHeight.value) {
            return getResizedHeightPosition();
        }

        if (isResizingWidth.value) {
            return getResizedWidthPosition();
        }

        return {
            top,
            left,
            width,
            height,
        };
    });

    // Points where element left snaps to when resized
    const leftResizeSnapPoints = computed(() => [
        ...columnsLefts.value,
        blockCenter.value,
    ]);

    // Points where element right snaps to when resized
    const rightResizeSnapPoints = computed(() => [
        ...columnsRights.value,
        blockCenter.value,
    ]);

    // Points where element and rows top/bottom snaps to when resized
    const yResizeSnapLocations = computed(() => allSnapYPoints.value.map(({
        location
    }) => location));

    // Returns resizedElementPosition with the width and left snapped to snap points
    const resizedElementSnapPositionWidth = computed(() => {
        const {
            left,
            width,
        } = resizedElementPosition.value;

        const closestLeft = findClosest(left, leftResizeSnapPoints.value);
        const distanceToLeft = Math.round(left - closestLeft);

        const closestRight = findClosest(left + width, rightResizeSnapPoints.value);
        const distanceToRight = Math.round((left + width) - closestRight);

        // Resize width from left side of element
        const shouldSnapLeft = Math.abs(distanceToLeft) < LAYOUT_SNAP_THRESHOLD_X;

        if (shouldSnapLeft && isResizingLeft.value) {
            return {
                left: closestLeft,
                width: width + distanceToLeft,
            };
        }

        // Resize width from right side of element
        const shouldSnapRight = Math.abs(distanceToRight) < LAYOUT_SNAP_THRESHOLD_X;

        if (shouldSnapRight && isResizingRight.value) {
            return {
                width: width - distanceToRight,
                left,
            };
        }

        return {
            width: null,
            left: null,
        };
    });

    // Returns resizedElementPosition with the top and height snapped to snap points
    const resizedElementSnapPositionHeight = computed(() => {
        const {
            height,
            top,
        } = resizedElementPosition.value;

        const closestTop = findClosest(top, yResizeSnapLocations.value);
        const distanceToTop = top - closestTop;

        const closestBottom = findClosest(top + height, yResizeSnapLocations.value);
        const distanceToBottom = (top + height) - closestBottom;

        // Resize height from top side of element
        const shouldSnapTop = Math.abs(distanceToTop) < LAYOUT_SNAP_THRESHOLD_Y;

        if (shouldSnapTop && isResizingTop.value) {
            return {
                top: closestTop,
                height: height + distanceToTop,
            };
        }

        // Resize height from bottom side of element
        const shouldSnapBottom = Math.abs(distanceToBottom) < LAYOUT_SNAP_THRESHOLD_Y;

        if (shouldSnapBottom && isResizingBottom.value) {
            return {
                top,
                height: height - distanceToBottom,
            };
        }

        return {
            top: null,
            height: null,
        };
    });

    const lockProportions = (position) => {
        const aspectRatio = initialElementPosition.value.width / initialElementPosition.value.height;
        const isResizingSides = isResizingLeft.value || isResizingRight.value;

        const resizedWidth = isResizingHeight.value ? aspectRatio * position.height : position.width;
        const resizedHeight = isResizingSides ? position.width / aspectRatio : position.height;

        const limitedWidth = Math.max(resizedWidth, getMinimumElementWidth(activeElementData.value.type));
        const limitedHeight = Math.max(resizedHeight, LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT);

        const isLayoutTop = position.top === 0;

        // this is similar logic like in resizedElementPosition to solve moving snapping problem
        const resizedTop = isResizingTopCorners.value && !isLayoutTop ? position.top + (position.height - limitedHeight) : position.top;

        return {
            left: position.left,
            top: resizedTop,
            width: limitedWidth,
            height: limitedHeight,
        };
    };

    // Returns resizedElementPosition with the whole position snapped to snap points, fit it to layout bounds
    const resizedElementSnapPosition = computed(() => {
        const {
            left,
            width,
            height,
            top,
        } = resizedElementPosition.value;

        const snapLeft = resizedElementSnapPositionWidth.value.left ? ? left;
        const snapWidth = resizedElementSnapPositionWidth.value.width || width;
        const snapTop = resizedElementSnapPositionHeight.value.top || top;
        const snapHeight = resizedElementSnapPositionHeight.value.height || height;

        const position = {
            left: snapLeft,
            top: snapTop,
            width: snapWidth,
            height: snapHeight,
        };

        const isResizingCorners = isResizingTopCorners.value || isResizingBottomCorners.value;

        if (isResizingCorners) {
            return fitToLayoutXBounds(lockProportions(position), blockWidth.value);
        }

        return fitToLayoutXBounds(position, blockWidth.value);
    });

    // #endregion

    const draggedMultiSelectedElementsPositions = computed(() => {
        if (!isMultiSelectActive.value || !initialElementPosition.value) {
            return {};
        }

        const multiSelectedElementsPositions = getMultiSelectedElementsPositions({
            multiSelectAreaPosition: multiSelectAreaPosition.value,
            draggedElementsSnapPosition: draggedElementSnapPosition.value,
            shouldFitToLayoutYBounds: false,
            multiSelectedElements: multiSelectedElements.value,
            elementPositionKey: elementPositionKey.value,
            blockWidth: blockWidth.value,
        });

        return multiSelectedElementsPositions;
    });

    const shouldSnap = computed(() => (isElementMovedToOtherBlock.value || shouldSnapToGuides.value || shouldSnapToElements.value));

    // Returns resizedElementSnappedPosition or draggedElementSnappedPosition depending on which one is active
    const renderedPosition = computed(() => {
        if (isMultiSelectActive.value) {
            return draggedElementId.value ? draggedElementSnapPosition.value : draggedElementPosition.value;
        }

        if (draggedElementId.value) {
            return shouldSnap.value ? draggedElementSnapPosition.value : draggedElementPosition.value;
        }

        if (resizedElementId.value) {
            return shouldSnap.value ? resizedElementSnapPosition.value : resizedElementPosition.value;
        }

        return {};
    });

    const multiSelectAreaRenderPosition = computed(() => {
        const leftOffset = isMobileMode.value ? MOBILE_BLOCK_PADDING_X : 0;

        if (isMultiSelectActive.value) {
            return {
                left: renderedPosition.value.left + leftOffset,
                top: renderedPosition.value.top,
                width: renderedPosition.value.width,
                height: renderedPosition.value.height,
            };
        }

        const {
            top: dragBoxTop,
            left: dragBoxLeft,
            width: dragBoxWidth,
            height: dragBoxHeight,
        } = dragBoxPosition.value;

        return {
            left: dragBoxLeft,
            top: dragBoxTop,
            width: dragBoxWidth,
            height: dragBoxHeight,
        };
    });

    const draggedElementsBellowActiveElementPositions = computed(() => {
        if (!isMovingElementsBellow.value) {
            return {};
        }

        const elementsBellowActiveElementPositions = getElementsBellowActiveElementPositions({
            initialElementPosition: initialElementPosition.value,
            draggedElementSnapPosition: draggedElementSnapPosition.value,
            elementPositionKey: elementPositionKey.value,
            lowerElementsRelativeToActive: lowerElementsRelativeToActive.value,
        });

        return elementsBellowActiveElementPositions;
    });

    const lowestElementBottom = computed(() => {
        // Could be lowest element bellow active element or active element itself if no elements are bellow
        const lowestElementPosition = lowestElementRelativeToActiveId.value ?
            draggedElementsBellowActiveElementPositions.value[lowestElementRelativeToActiveId.value] :
            renderedPosition.value;

        const {
            top: lowestElementTop,
            height: lowestElementHeight,
        } = lowestElementPosition;

        return lowestElementTop + lowestElementHeight;
    });
    const elementsCSSVars = computed(() => {
        if (!Object.keys(draggedMultiSelectedElementsPositions.value).length &&
            !Object.keys(draggedElementsBellowActiveElementPositions.value).length
        ) {
            return {};
        }

        const draggedElementsPositions = Object.keys(draggedMultiSelectedElementsPositions.value).length ?
            draggedMultiSelectedElementsPositions.value :
            {
                [activeElementId.value]: renderedPosition.value,
                ...draggedElementsBellowActiveElementPositions.value,
            };

        return Object.fromEntries(Object.entries(draggedElementsPositions).map(([elementId, position]) => {
            const elementCssVar = {
                '--element-top': `${position.top}px`,
                '--element-left': `${position.left}px`,
                '--element-width': `${position.width}px`,
                '--element-height': `${position.height}px`,
            };

            return [
                elementId,
                elementCssVar,
            ];
        }));
    });

    // Returns CSS variable object (formerly computedStyles, just more specific)
    const elementCSSVars = computed(() => {
        if (!activeElementData.value || Object.keys(elementsCSSVars.value).length) {
            return null;
        }

        const isActiveElementHeightResizable = RESIZABLE_HEIGHT_ELEMENT_TYPES.includes(activeElementData.value.type);

        return {
            '--element-top': `${renderedPosition.value.top}px`,
            '--element-left': `${renderedPosition.value.left}px`,
            '--element-width': `${renderedPosition.value.width}px`,
            '--element-height': isActiveElementHeightResizable ? `${renderedPosition.value.height}px` : 'auto',
        };
    });

    // Visual snapping point for x axis
    const xSnapPoints = computed(() => {
        if (!activeElementId.value) {
            return null;
        }

        if (draggedElementId.value) {
            const {
                width,
                left,
            } = renderedPosition.value;

            const centerXPoint = Math.round(left + width / 2);
            const rightPoint = left + width;

            const snapPoints = [];

            if (leftDragSnapLocations.value.includes(left)) {
                snapPoints.push(left);
            }

            if (centerXDragSnapLocations.value.includes(centerXPoint)) {
                snapPoints.push(centerXPoint);
            }

            if (rightDragSnapLocations.value.includes(rightPoint)) {
                snapPoints.push(rightPoint);
            }

            return allSnapXPoints.value.filter(({
                location
            }) => snapPoints.includes(location));
        }

        if (resizedElementId.value) {
            const {
                width,
                left,
            } = renderedPosition.value;

            const rightPoint = Math.round(left + width);
            const snapPoints = [];

            if (leftResizeSnapPoints.value.includes(left)) {
                snapPoints.push(left);
            }

            if (rightResizeSnapPoints.value.includes(rightPoint)) {
                snapPoints.push(rightPoint);
            }

            return allSnapXPoints.value.filter(({
                location
            }) => snapPoints.includes(location));
        }

        return null;
    });
    // Visual snapping point for y axis
    const ySnapPoints = computed(() => {
        if (!activeElementId.value) {
            return null;
        }

        if (draggedElementId.value) {
            const {
                height,
                top,
            } = renderedPosition.value;

            const centerYPoint = Math.round(top + height / 2);
            const bottomPoint = top + height;

            const validPoints = [
                top,
                centerYPoint,
                bottomPoint,
            ];

            return allSnapYPoints.value.filter(({
                location
            }) => validPoints.includes(location));
        }

        if (resizedElementId.value) {
            const {
                height,
                top,
            } = renderedPosition.value;
            const bottomPoint = top + height;

            const validPoints = [
                top,
                bottomPoint,
            ];

            return allSnapYPoints.value.filter(({
                location
            }) => validPoints.includes(location));
        }

        return null;
    });

    const updateElementsData = ({
        elementsPositions,
        moveToAnotherBlock,
        oldBlockId,
        elementSnapPosition,
    }) => {
        const multiSelectAreaDOMPosition = moveToAnotherBlock ? getElementPositionFromDOM({
            elementId: `${oldBlockId}-drag-box`,
            blockId: hoveredBlockId.value,
        }) : {};

        const {
            top: multiSelectedAreaTop
        } = fitToLayoutYBounds(multiSelectAreaDOMPosition);

        Object.entries(elementsPositions)
            .forEach(([elementId, elementPosition]) => {
                if (moveToAnotherBlock) {
                    dispatch('moveElementBetweenBlocks', {
                        elementId,
                        oldBlockId,
                        newBlockId: hoveredBlockId.value,
                    });
                }

                const topOffset = moveToAnotherBlock ? Math.abs(elementSnapPosition.top - elementPosition.top) : 0;

                const {
                    top: elementTop,
                    left: elementLeft,
                    width: elementWidth,
                    height: elementHeight,
                } = fitToLayoutYBounds(elementPosition);

                dispatch('mergeElementData', {
                    elementId,
                    elementData: {
                        [elementPositionKey.value]: {
                            top: moveToAnotherBlock ? multiSelectedAreaTop + topOffset : elementTop,
                            left: elementLeft,
                            width: elementWidth,
                            height: elementHeight,
                        },
                    },
                    pushToHistory: true,
                });
            });
    };

    // Methods / callbacks
    const updateActiveElementData = () => {
        if (isMultiSelectActive.value) {
            const multiSelectedElementsPositions = getMultiSelectedElementsPositions({
                multiSelectAreaPosition: multiSelectAreaPosition.value,
                draggedElementsSnapPosition: draggedElementSnapPosition.value,
                shouldFitToLayoutYBounds: !isElementMovedToOtherBlock.value,
                multiSelectedElements: multiSelectedElements.value,
                elementPositionKey: elementPositionKey.value,
                blockWidth: blockWidth.value,
            });

            updateElementsData({
                elementsPositions: multiSelectedElementsPositions,
                moveToAnotherBlock: isElementMovedToOtherBlock.value,
                oldBlockId: draggedElementBlockId.value,
                elementSnapPosition: draggedElementSnapPosition.value,
            });

            return;
        }

        if (activeElementId.value === 'multiSelectArea') {
            return;
        }

        if (isMovingElementsBellow.value) {
            const elementsBellowActiveElementPositions = getElementsBellowActiveElementPositions({
                initialElementPosition: initialElementPosition.value,
                draggedElementSnapPosition: draggedElementSnapPosition.value,
                elementPositionKey: elementPositionKey.value,
                lowerElementsRelativeToActive: lowerElementsRelativeToActive.value,
            });

            updateElementsData({
                elementsPositions: {
                    [activeElementId.value]: renderedPosition.value,
                    ...elementsBellowActiveElementPositions,
                },
                moveToAnotherBlock: isElementMovedToOtherBlock.value,
                oldBlockId: draggedElementBlockId.value,
                elementSnapPosition: draggedElementSnapPosition.value,
            });

            return;
        }

        const position = isElementMovedToOtherBlock.value ?
            getElementPositionFromDOM({
                elementId: activeElementId.value,
                blockId: hoveredBlockId.value,
                leftOffset: isMobileMode.value ? MOBILE_BLOCK_PADDING_X : 0,
            }) :
            renderedPosition.value;

        const {
            top,
            left,
            width,
            height,
        } = fitToLayoutYBounds(position);

        if (isElementMovedToOtherBlock.value) {
            dispatch('moveElementBetweenBlocks', {
                elementId: activeElementId.value,
                oldBlockId: draggedElementBlockId.value,
                newBlockId: hoveredBlockId.value,
            });
        }

        dispatch('mergeElementData', {
            elementId: activeElementId.value,
            elementData: {
                [elementPositionKey.value]: {
                    top,
                    left,
                    width,
                    height,
                },
            },
            pushToHistory: true,
        });
    };

    const stopDraggingElement = async () => {
        updateActiveElementData();
        draggedElementId.value = null;
        dispatch('undoRedo/createSnapshot');
        context.emit('set-edit-control-visibility', true);

        if (isMovingElementsBellow.value) {
            isMovingElementsBellow.value = false;
            gapBetweenLastElementAndBlockHeight.value = 0;

            if (blockHeightOnResize.value) {
                saveBlockMinHeight({
                    minHeight: blockHeightOnResize.value,
                    saveToHistory: true,
                });
                resizedSectionId.value = null;
            }
        }

        await nextTick();
        updateMultiSelectedElements({
            shouldForceUpdate: true,
            layoutElements: layoutElements.value,
        });
    };

    const startDraggingElement = ({
        elementId,
        shouldMoveElementsBellow = false,
    }) => {
        if (!(getters.isEditingTextBoxElement && siteElements.value[elementId].type === ELEMENT_TYPE_TEXT_BOX)) {
            draggedElementId.value = elementId;

            isMovingElementsBellow.value = shouldMoveElementsBellow;
            context.emit('set-edit-control-visibility', false);

            startDragging({
                onDragEnd: stopDraggingElement,
            });
        }
    };

    const stopResizingElement = () => {
        updateElementPositionFromDOM({
            dispatch,
            elementId: activeElementId.value,
            blockId: props.blockId,
            isMobileMode: isMobileMode.value,
            pushToHistory: true,
        });
        resizedElementId.value = null;
        resizedDirection.value = null;

        context.emit('set-edit-control-visibility', true);

        dispatch('undoRedo/createSnapshot');
    };

    const startResizingElement = (elementId, direction) => {
        resizedElementId.value = elementId;
        resizedDirection.value = direction;

        context.emit('set-edit-control-visibility', false);

        startDragging({
            onDragEnd: stopResizingElement,
        });
    };

    const onDrop = (event) => {
        const {
            elementId,
            elementData,
            width,
            height,
        } = addElementData.value;

        // User drag-n-dropped non-element object on section
        if (!elementData) return;

        addLayoutElement({
            layoutElements: layoutElements.value,
            blockId: props.blockId,
            blockToAddRef: event.currentTarget,
            elementId,
            newElementData: elementData,
            newElementRawLeft: event.clientX,
            newElementRawTop: event.clientY,
            newElementRawWidth: width,
            newElementRawHeight: height,
        });

        dispatch('updateAddElementData', {});
    };

    const handleElementSizeChange = (elementId) => {
        const isElementInSiteElements = !!getters.siteElements[elementId];

        if (!activeElementId.value && isElementInSiteElements) {
            updateElementPositionFromDOM({
                dispatch,
                elementId,
                blockId: props.blockId,
                isMobileMode: isMobileMode.value,
                pushToHistory: false,
            });
        }
    };

    // Get resize direction handles according to element type
    const getResizeDirections = (type) => {
        if (RESIZABLE_HEIGHT_ELEMENT_TYPES.includes(type)) {
            return LAYOUT_ELEMENT_RESIZE_DIRECTIONS;
        }

        if (RESIZABLE_WIDTH_ELEMENT_TYPES.includes(type)) {
            return [
                'left',
                'right',
            ];
        }

        return [];
    };

    watch(draggedElementsBellowActiveElementPositions, () => {
        if (!isMovingElementsBellow.value) {
            return;
        }

        if (!gapBetweenLastElementAndBlockHeight.value) {
            gapBetweenLastElementAndBlockHeight.value = blockHeight.value - lowestElementBottom.value;
        }

        const newSectionHeight = lowestElementBottom.value + gapBetweenLastElementAndBlockHeight.value;

        if (newSectionHeight >= blockHeight.value && !resizedSectionId.value) {
            resizedSectionId.value = draggedElementBlockId.value;
        }

        if (resizedSectionId.value) {
            blockHeightOnResize.value = newSectionHeight;

            // Having separate variable for block height while spacing is changed
            // is needed to prevent unnecessary layout calculations, performance issues
            if (!blockHeightWhileSpacingIsChanged.value ||
                blockHeightWhileSpacingIsChanged.value < newSectionHeight
            ) {
                blockHeightWhileSpacingIsChanged.value = newSectionHeight;
            }
        }
    });

    return {
        hasMouseMoved,
        activeElementId,
        elementCSSVars,
        elementsCSSVars,
        layoutElements,
        layoutCSSVars,
        isMobileLegacy,
        isMobileMode,
        xSnapPoints,
        ySnapPoints,
        startDraggingElement,
        handleElementSizeChange,
        startResizingElement,
        onDrop,
        getResizeDirections,
        isElementMovedToOtherBlock,
        renderedPosition,
        buildResponsiveGrid,
        columnCount,
        blockLayoutRef,
        updateElementPositionFromDOM,
        snapRowHeight,
        snapRowGap,
        shouldSnapToGuides,
        isViewingLayoutSettings,
        multiSelectedElementsIds,
        multiSelectedElements,
        updateMultiSelectedElements,
        isMultiSelectActive,
        isMultiSelecting,
        startSelection,
        updateSelection,
        endSelection,
        isDragging,
        multiSelectAreaRenderPosition,
        resetMultiSelection,
        multiSelectedBlockId,
        lowerElementsIdsRelativeToActive,
        isMovingElementsBellow,
        isDraggingElement,
        sectionResizeBlockingElementId,
    };
};