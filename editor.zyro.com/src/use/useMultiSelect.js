import {
    computed,
    ref,
    watch,
} from 'vue';

import {
    useStore
} from 'vuex';

import {
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import {
    MULTISELECT_MINIMUM_SELECT_ITEMS_LENGTH
} from '@/constants';

export const getMultiSelectAreaPosition = ({
    multiSelectedElements,
    elementPositionKey,
}) => {
    const multiSelectedElementsPositions = Object.values(multiSelectedElements).reduce((positions, currentElement) => {
        const {
            top: elementTop,
            height: elementHeight,
            left: elementLeft,
            width: elementWidth,
        } = currentElement[elementPositionKey];

        const elementRight = elementLeft + elementWidth;
        const elementBottom = elementTop + elementHeight;

        return {
            top: [
                ...positions.top,
                elementTop,
            ],
            left: [
                ...positions.left,
                elementLeft,
            ],
            right: [
                ...positions.right,
                elementRight,
            ],
            bottom: [
                ...positions.bottom,
                elementBottom,
            ],
        };
    }, {
        top: [],
        left: [],
        right: [],
        bottom: [],
    });

    const multiSelectedAreaLeft = Math.min(...multiSelectedElementsPositions.left);
    const multiSelectedAreaTop = Math.min(...multiSelectedElementsPositions.top);
    const multiSelectedAreaRight = Math.max(...multiSelectedElementsPositions.right);
    const multiSelectedAreaBottom = Math.max(...multiSelectedElementsPositions.bottom);

    return {
        left: multiSelectedAreaLeft,
        top: multiSelectedAreaTop,
        width: multiSelectedAreaRight - multiSelectedAreaLeft,
        height: multiSelectedAreaBottom - multiSelectedAreaTop,
    };
};

export const checkIfElementIsMultiSelected = ({
    elementPosition,
    multiSelectPosition,
}) => {
    const {
        top: elementTop,
        height: elementHeight,
        left: elementLeft,
        width: elementWidth,
    } = elementPosition;
    const elementBottom = elementTop + elementHeight;
    const elementRight = elementLeft + elementWidth;

    const {
        top: multiSelectTop,
        bottom: multiSelectBottom,
        left: multiSelectLeft,
        right: multiSelectRight,
    } = multiSelectPosition;

    const isElementTopInsideMultiSelectArea = elementTop >= multiSelectTop &&
        elementTop <= multiSelectBottom;
    const isElementBottomInsideMultiSelectArea = elementBottom >= multiSelectTop &&
        elementBottom <= multiSelectBottom;
    const isMultiSelectAreaInsideElementY = elementTop <= multiSelectTop &&
        elementBottom >= multiSelectBottom;

    const isElementLeftInsideMultiSelectArea = elementLeft >= multiSelectLeft &&
        elementLeft <= multiSelectRight;
    const isElementRightInsideMultiSelectArea = elementRight >= multiSelectLeft &&
        elementRight <= multiSelectRight;
    const isMultiSelectAreaInsideElementX = elementLeft <= multiSelectLeft &&
        elementRight >= multiSelectRight;

    const isElementSelectedVertically = isElementTopInsideMultiSelectArea ||
        isElementBottomInsideMultiSelectArea ||
        isMultiSelectAreaInsideElementY;
    const isElementSelectedHorizontally = isElementLeftInsideMultiSelectArea ||
        isElementRightInsideMultiSelectArea ||
        isMultiSelectAreaInsideElementX;

    return isElementSelectedVertically && isElementSelectedHorizontally;
};

export const useMultiSelect = () => {
    const {
        getters,
        dispatch,
        state,
    } = useStore();
    const currentBlockId = computed(() => state.currentBlockId);
    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

    const dragBoxPosition = ref({});
    const dragBoxStartXPosition = ref(null);
    const dragBoxStartYPosition = ref(null);

    const multiSelectAreaPosition = ref({});

    const multiSelectedBlockId = ref(null);
    const multiSelectedElements = ref({});
    const multiSelectedElementsIds = computed(() => Object.keys(multiSelectedElements.value));

    const isMultiSelecting = ref(false);
    const isMultiSelectActive = computed(() => multiSelectedElementsIds.value.length > MULTISELECT_MINIMUM_SELECT_ITEMS_LENGTH &&
        !isMultiSelecting.value);

    const multiSelectedBlockPosition = computed(() => (multiSelectedBlockId.value ?
        document.querySelector(`[data-block-ref='${multiSelectedBlockId.value}']`).getBoundingClientRect() :
        {}));

    const topOffset = computed(() => multiSelectedBlockPosition.value.top);
    const leftOffset = computed(() => multiSelectedBlockPosition.value.left);

    const multiSelectPosition = computed(() => {
        const {
            top: dragBoxTop,
            left: dragBoxLeft,
            width: dragBoxWidth,
            height: dragBoxHeight,
        } = dragBoxPosition.value;
        const top = dragBoxTop - topOffset.value;
        const bottom = top + dragBoxHeight;
        const left = dragBoxLeft - leftOffset.value;
        const right = left + dragBoxWidth;

        return {
            top,
            bottom,
            left,
            right,
        };
    });

    const resetMultiSelection = () => {
        dragBoxPosition.value = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
        };

        multiSelectedElements.value = {};
        multiSelectedBlockId.value = null;
    };

    const startSelection = ({
        event,
        blockId,
    }) => {
        resetMultiSelection();

        dragBoxStartXPosition.value = event.pageX;
        dragBoxStartYPosition.value = event.pageY;
        dragBoxPosition.value = {
            top: event.pageY,
            left: event.pageX,
            width: 0,
            height: 0,
        };

        isMultiSelecting.value = true;
        multiSelectedBlockId.value = blockId;
    };

    // shouldForceUpdate is needed to update previously selected element positions
    const updateMultiSelectedElements = ({
        layoutElements,
        shouldForceUpdate,
    }) => {
        if (!isMultiSelecting.value && !shouldForceUpdate) {
            return;
        }

        multiSelectedElements.value = Object.fromEntries(
            layoutElements
            .map((element) => {
                const isElementAlreadyMultiSelected = multiSelectedElementsIds.value.includes(element.elementId);

                // If element is already multi-selected don't check if it fits in original select box
                if (!isMultiSelecting.value && isElementAlreadyMultiSelected) {
                    return [
                        element.elementId,
                        element,
                    ];
                }

                const isElementMultiSelected = checkIfElementIsMultiSelected({
                    elementPosition: element[elementPositionKey.value],
                    multiSelectPosition: multiSelectPosition.value,
                });

                if (isElementMultiSelected) {
                    return [
                        element.elementId,
                        element,
                    ];
                }

                return [];
            })
            .filter(([elementId]) => !!elementId),
        );

        multiSelectAreaPosition.value = getMultiSelectAreaPosition({
            multiSelectedElements: multiSelectedElements.value,
            elementPositionKey: elementPositionKey.value,
        });
    };

    const updateSelection = ({
        event,
        layoutElements,
    }) => {
        if (!isMultiSelecting.value) {
            return;
        }

        dragBoxPosition.value = {
            top: Math.min(dragBoxStartYPosition.value, event.pageY),
            left: Math.min(dragBoxStartXPosition.value, event.pageX),
            width: Math.abs(event.pageX - dragBoxStartXPosition.value),
            height: Math.abs(event.pageY - dragBoxStartYPosition.value),
        };

        updateMultiSelectedElements({
            shouldForceUpdate: false,
            layoutElements,
        });
    };

    const endSelection = () => {
        if (multiSelectedElementsIds.value.length === MULTISELECT_MINIMUM_SELECT_ITEMS_LENGTH) {
            dispatch('selectCurrentElement', {
                elementId: multiSelectedElementsIds.value[0],
            });
        }

        isMultiSelecting.value = false;
    };

    watch([
        isMobileMode,
        currentBlockId,
    ], () => {
        resetMultiSelection();
    });

    return {
        isMultiSelecting,
        isMultiSelectActive,
        multiSelectedBlockId,
        multiSelectedElements,
        multiSelectedElementsIds,
        startSelection,
        updateSelection,
        endSelection,
        resetMultiSelection,
        updateMultiSelectedElements,
        dragBoxStartXPosition,
        dragBoxStartYPosition,
        dragBoxPosition,
        multiSelectPosition,
        multiSelectAreaPosition,
    };
};