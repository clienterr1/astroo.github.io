import {
    ref,
    computed,
    watch,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    useDrag
} from '@/use/useDrag';
import {
    useMousePosition
} from '@/use/useMousePosition';

import {
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import {
    DEFAULT_MOBILE_BLOCK_HEIGHT
} from '@zyro-inc/site-modules/components/blocks/layout/constants';
import {
    LAYOUT_MIN_HEIGHT_THRESHOLD,
    LAYOUT_MIN_SECTION_HEIGHT,

    CONTROL_LINE_SCROLL_START_THRESHOLD,
    CONTROL_LINE_SCROLL_AMOUNT,
    CONTROL_LINE_SCROLL_INTERVAL_DELAY,
} from '@/constants';

const blockingElementId = ref(null);

export const blockHeightOnResize = ref(null);
export const resizedSectionId = ref(null);

export const useSectionResizing = (props, context) => {
    const {
        getters,
        dispatch,
        state,
    } = useStore();
    const siteElements = computed(() => getters.siteElements);
    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const desktopPreviewRef = computed(() => state.gui.desktopPreviewRef);

    const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

    const initialWindowOffsetY = ref(0);
    const scrollDistance = ref(0);
    const autoResizeInterval = ref(null);

    const {
        startDragging,
        mouseDeltaY,
        isDragging,
    } = useDrag();
    const {
        mouseY
    } = useMousePosition();

    const resizeHandleDirection = ref(null);

    const blockData = computed(() => getters.siteBlocks[props.blockId]);

    const lowestElement = computed(() => {
        const blockElements = blockData.value ? .components;

        if (!blockElements || !blockElements.length) {
            return null;
        }

        //  Get elements bottom positions inside block
        //  Sort elements by bottom position in descending order
        return blockElements
            .map((elementId) => {
                const {
                    desktop,
                    mobile,
                } = siteElements.value[elementId];

                const bottom = (isMobileMode.value && mobile) ?
                    mobile.top + mobile.height :
                    desktop.top + desktop.height;

                return {
                    bottom,
                    elementId,
                };
            })
            .sort((a, b) => b.bottom - a.bottom)[0];
    });

    const lowestElementBottom = computed(() => lowestElement.value ? .bottom || 0);

    const blockMinHeight = computed(() => {
        if (isMobileMode.value) {
            const defaultMobileHeight = DEFAULT_MOBILE_BLOCK_HEIGHT > lowestElementBottom.value ?
                DEFAULT_MOBILE_BLOCK_HEIGHT :
                lowestElementBottom.value;

            return blockData.value.mobile ? .minHeight || defaultMobileHeight;
        }

        return blockData.value.desktop.minHeight;
    });

    // Initial value is required for history
    const initialBlockMinHeight = ref(null);

    // newBlockMinHeight should only have a value when resizing
    const newBlockMinHeight = computed(() => {
        if (!isDragging.value) {
            return null;
        }

        return Math.max(
            LAYOUT_MIN_SECTION_HEIGHT,
            blockMinHeight.value + mouseDeltaY.value + scrollDistance.value,
            lowestElementBottom.value + LAYOUT_MIN_HEIGHT_THRESHOLD,
        );
    });

    const isMinHeightReached = computed(() => newBlockMinHeight.value === lowestElementBottom.value + LAYOUT_MIN_HEIGHT_THRESHOLD ||
        newBlockMinHeight.value === LAYOUT_MIN_SECTION_HEIGHT);

    const resizeHandleType = computed(() => {
        if (isDragging.value && isMinHeightReached.value) {
            return 'error';
        }

        return 'default';
    });

    const shouldScrollDown = computed(() => {
        const bottomThreshold = mouseY.value > document.documentElement.clientHeight - CONTROL_LINE_SCROLL_START_THRESHOLD;
        const isCursorBelowHandle = resizeHandleDirection.value > 0;

        return bottomThreshold && isCursorBelowHandle;
    });

    const shouldScrollUp = computed(() => {
        const topThreshold = mouseY.value < CONTROL_LINE_SCROLL_START_THRESHOLD;
        const isCursorAboveHandle = resizeHandleDirection.value < 0;

        return topThreshold && isCursorAboveHandle;
    });

    const shouldScroll = computed(() => (shouldScrollDown.value || shouldScrollUp.value) && !isMinHeightReached.value);

    const scrollAmount = computed(() => {
        if (!shouldScroll.value) {
            return 0;
        }

        return shouldScrollDown.value ? CONTROL_LINE_SCROLL_AMOUNT : -CONTROL_LINE_SCROLL_AMOUNT;
    });

    function scrollPage(scrollByAmount) {
        desktopPreviewRef.value.scrollBy(0, scrollByAmount);
    }

    const saveBlockMinHeight = ({
        minHeight,
        saveToHistory,
    }) => {
        if (!minHeight) {
            return;
        }

        dispatch('updateBlockData', {
            blockId: props.blockId,
            blockData: {
                [elementPositionKey.value]: {
                    minHeight,
                },
            },
            merge: true,
        });
        if (saveToHistory) {
            dispatch('undoRedo/createSnapshot');
        }
    };

    const stopSectionResizing = () => {
        saveBlockMinHeight({
            minHeight: newBlockMinHeight.value,
            saveToHistory: true,
        });

        context.emit('lock-hovered-block', false);
        context.emit('set-edit-control-visibility', true);
        blockHeightOnResize.value = null;
        resizedSectionId.value = null;
        scrollDistance.value = 0;
    };

    const startSectionResizing = () => {
        // Save initial block minHeight to save in history after resize ended
        initialBlockMinHeight.value = blockMinHeight.value;

        // Save initial window offsetY to calculate scroll distance
        initialWindowOffsetY.value = window.pageYOffset;

        startDragging({
            onDragEnd: stopSectionResizing,
        });

        resizedSectionId.value = props.blockId;
        context.emit('set-edit-control-visibility', false);
        context.emit('lock-hovered-block', true);
    };

    watch(newBlockMinHeight, (newHeight, oldHeight) => {
        blockHeightOnResize.value = newBlockMinHeight.value;

        resizeHandleDirection.value = isDragging.value ? Math.sign(newHeight - oldHeight) : 0;
    });

    watch(shouldScroll, () => {
        if (shouldScroll.value && !autoResizeInterval.value) {
            autoResizeInterval.value = setInterval(() => {
                scrollPage(scrollAmount.value);

                scrollDistance.value = scrollAmount.value + window.pageYOffset - initialWindowOffsetY.value;
            }, CONTROL_LINE_SCROLL_INTERVAL_DELAY);
        } else {
            clearInterval(autoResizeInterval.value);
            autoResizeInterval.value = null;
        }
    });

    watch(isMinHeightReached, () => {
        if (isMinHeightReached.value && lowestElement.value) {
            blockingElementId.value = lowestElement.value.elementId;
        } else {
            blockingElementId.value = null;
        }
    });

    watch(lowestElementBottom, () => {
        if (!blockData.value) return;
        if (lowestElementBottom.value >= blockMinHeight.value) {
            // Do not save to history when resize is triggered from watcher
            saveBlockMinHeight({
                minHeight: lowestElementBottom.value,
                saveToHistory: false,
            });
        }
    });

    return {
        blockingElementId,
        startSectionResizing,
        resizeHandleType,
        resizeHandleDirection,
        saveBlockMinHeight,
    };
};