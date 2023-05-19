import {
    useStore
} from 'vuex';
import {
    computed,
    nextTick,
} from 'vue';

import {
    getDeviceElementHeight
} from '@/utils/getDeviceElementHeight';

import {
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

export const useDeviceElementHeight = () => {
    const {
        getters,
        dispatch,
    } = useStore();

    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const siteElements = computed(() => getters.siteElements);
    const currentBlock = computed(() => getters.currentBlock);
    const siteBlocks = computed(() => getters.siteBlocks);
    const elementPositionKeyReversed = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_DESKTOP : ELEMENT_POSITION_KEY_MOBILE));

    /**
     * Updates element height property for other devices (mobile or desktop)
     * If element edited on desktop it updates mobile height property and vice versa
     * @param {elementId} elementId - id of an element
     *
     */
    const updateElementHeightOnDevices = async ({
        elementId,
        blockId,
    }) => {
        // This is needed because we need fully rendered element after it was updated
        await nextTick();

        const blockData = blockId ? siteBlocks.value[blockId] : currentBlock.value;
        const elementToUpdate = siteElements.value[elementId];
        const elementWidth = elementToUpdate[elementPositionKeyReversed.value].width;

        const deviceElementHeight = getDeviceElementHeight({
            elementId,
            elementPositionKey: elementPositionKeyReversed.value,
            elementWidth,
        });

        dispatch('mergeElementData', {
            elementId,
            elementData: {
                [elementPositionKeyReversed.value]: {
                    height: deviceElementHeight,
                },
            },
            pushToHistory: false,
        });

        // Element nudging is currently limited only to mobile viewport while user edits on desktop mode
        if (isMobileMode.value) return;

        const heightDifference = deviceElementHeight - elementToUpdate.mobile.height;

        // Nudge other elements down by height difference
        Object.values(blockData ? .components || {})
            .filter((blockElementId) => blockElementId !== elementId)
            .forEach((blockElementId) => {
                const {
                    top
                } = siteElements.value[blockElementId].mobile;

                // We do not want to affect elements that are above
                if (top < elementToUpdate.mobile.top) return;

                dispatch('mergeElementData', {
                    elementId: blockElementId,
                    elementData: {
                        mobile: {
                            top: top + heightDifference,
                        },
                    },
                    pushToHistory: false,
                });
            });
    };

    return {
        updateElementHeightOnDevices,
    };
};