import {
    computed,
    nextTick,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    cloneBlock
} from '@/utils/siteDataUtils';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    updateElementPositionFromDOM
} from '@/components/block-layout/useLayout';

import {
    useDeviceElementHeight
} from '@/use/useDeviceElementHeight';

import {
    BLOCK_TYPE_LAYOUT
} from '@zyro-inc/site-modules/constants';

export const useAddBlock = () => {
    const {
        dispatch,
        getters,
        state,
    } = useStore();

    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const currentLocale = computed(() => state.currentLocale);
    const currentPageId = computed(() => state.currentPageId);
    const activeModalSettings = computed(() => state.gui.activeModalSettings);
    const previousBlockId = computed(() => activeModalSettings.value.previousBlockId);
    const {
        updateElementHeightOnDevices
    } = useDeviceElementHeight();

    const addBlock = async ({
        blockId,
        slot,
        template,
    }) => {
        const {
            newBlock,
            newElements,
            newBlocks,
        } = cloneBlock({
            siteData: template,
            blockId,
            slot,
            fromLocale: 'system',
            toLocale: currentLocale.value,
        });

        const newBlockId = generateRandomId();

        dispatch('addBlock', {
            pageId: slot === 'footer' ? null : currentPageId.value,
            blockId: newBlockId,
            previousBlockId: previousBlockId.value,
            blockData: newBlock,
            blocks: newBlocks,
            elements: newElements,
        });

        await nextTick();

        // Recalculate layout element position and size after addition.
        // Template element positions are calculated using template styles
        // which are usually different than website styles
        if (newBlock.type === BLOCK_TYPE_LAYOUT) {
            Object.keys(newElements).forEach((elementId) => {
                updateElementPositionFromDOM({
                    dispatch,
                    elementId,
                    blockId: newBlockId,
                    isMobileMode: isMobileMode.value,
                    pushToHistory: true,
                });

                if (newElements[elementId].type === 'GridTextBox') {
                    updateElementHeightOnDevices({
                        elementId,
                        blockId: newBlockId,
                    });
                }
            });
        }
    };

    return {
        addBlock,
    };
};